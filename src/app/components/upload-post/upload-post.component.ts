import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-post',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, CommonModule], // Add required modules
  templateUrl: './upload-post.component.html',
  styleUrls: ['./upload-post.component.css']
})
export class UploadPostComponent implements OnInit {
  categoriesList: string[] = ['News', 'Sports', 'Tech', 'Business'];
  uploadForm!: FormGroup;
  previewMode: boolean = false;
  previewData: any;

  // Reference to the Quill editor
  @ViewChild('quillEditor') quillEditor!: QuillEditorComponent;

  constructor(private fb: FormBuilder, private location: Location) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(300)]],
      categories: this.fb.array(this.categoriesList.map(() => this.fb.control(false))),
      files: [null]
    });
  }

  get categoriesFormArray(): FormArray {
    return this.uploadForm.get('categories') as FormArray;
  }

  get categoryControls(): FormControl[] {
    return this.categoriesFormArray.controls as FormControl[];
  }

  get selectedCategories(): string[] {
    return this.categoryControls
      .map((ctrl, index) => (ctrl.value ? this.categoriesList[index] : null))
      .filter(category => category !== null) as string[];
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length) {
      this.uploadForm.patchValue({ files: event.target.files });
    }
  }

  onPreview(): void {
    this.previewMode = true;
    this.previewData = {
      title: this.uploadForm.value.title,
      categories: this.selectedCategories,
      textContent: this.quillEditor.quillEditor.root.innerHTML, // Get Quill content
      files: this.uploadForm.value.files ? Array.from(this.uploadForm.value.files) : []
    };
  }

  onUpload(): void {
    const quillContent = this.quillEditor.quillEditor.root.innerHTML; // Get Quill content
    const formData = {
      ...this.uploadForm.value,
      textContent: quillContent // Add Quill content to form data
    };

    console.log('Uploading post data locally:', formData);
    localStorage.setItem('uploadedPost', JSON.stringify(formData));
    alert('Post uploaded locally!');
    this.uploadForm.reset();
    this.previewMode = false;
  }

  goBack(): void {
    this.location.back();
  }
}