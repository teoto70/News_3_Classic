import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-upload-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload-post.component.html',
  styleUrls: ['./upload-post.component.css']
})
export class UploadPostComponent implements OnInit {
  // Define the available categories (you can later share these with your header)
  categoriesList: string[] = ['News', 'Sports', 'Tech', 'Business'];

  // Reactive form for the upload
  uploadForm!: FormGroup;

  // Controls whether the preview mode is active
  previewMode: boolean = false;

  // Data object for the preview section
  previewData: any;

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnInit(): void {
    // Initialize the reactive form
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(300)]],
      // Create a FormArray of FormControls (each initialized with false)
      categories: this.fb.array(this.categoriesList.map(() => this.fb.control(false))),
      textContent: ['', Validators.required],
      files: [null]
    });
  }

  // Convenience getter for the categories FormArray
  get categoriesFormArray(): FormArray {
    return this.uploadForm.get('categories') as FormArray;
  }

  // Getter that casts each control to a FormControl for template use
  get categoryControls(): FormControl[] {
    return this.categoriesFormArray.controls as FormControl[];
  }

  // Returns the list of selected category names
  get selectedCategories(): string[] {
    return this.categoryControls
      .map((ctrl, index) => (ctrl.value ? this.categoriesList[index] : null))
      .filter(category => category !== null) as string[];
  }

  // Handle file selection changes
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.uploadForm.patchValue({ files: event.target.files });
    }
  }

  // Toggle preview mode and prepare preview data
  onPreview(): void {
    this.previewMode = true;
    this.previewData = {
      title: this.uploadForm.value.title,
      categories: this.selectedCategories,
      textContent: this.uploadForm.value.textContent,
      files: this.uploadForm.value.files ? Array.from(this.uploadForm.value.files) : []
    };
  }

  // Handle the upload (for now, log the data and store it locally)
  onUpload(): void {
    console.log('Uploading post data locally:', this.uploadForm.value);
    localStorage.setItem('uploadedPost', JSON.stringify(this.uploadForm.value));
    alert('Post uploaded locally!');
    this.uploadForm.reset();
    this.previewMode = false;
  }

  // Use Angular's Location service to navigate back
  goBack(): void {
    this.location.back();
  }
}
