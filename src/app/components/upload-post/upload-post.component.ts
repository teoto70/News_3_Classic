import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { v4 as uuidv4 } from 'uuid';

// Material + Custom pipes
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SafeHtmlPipe } from '../safehtml/safe-html.pipe';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-upload-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SafeHtmlPipe,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    AngularEditorModule
  ],
  templateUrl: './upload-post.component.html',
  styleUrls: ['./upload-post.component.css']
})
export class UploadPostComponent implements OnInit {
  readonly categoriesList: string[] = ['News', 'Sports', 'Tech', 'Business'];
  uploadForm!: FormGroup;
  previewMode: boolean = false;
  previewData: any = {
    title: '',
    categories: [],
    textContent: '',
    files: []
  };

  images: File[] = [];
  videos: File[] = [];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '250px',
    minHeight: '150px',
    placeholder: 'Enter content here...',
    translate: 'no'
  };

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private firestore: Firestore,
    private storage: Storage
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(300)]],
      categories: this.fb.array(
        this.categoriesList.map(() => new FormControl<boolean>(false, { nonNullable: true })),
        { validators: Validators.required }
      ),
      files: [null],
      content: ['', Validators.required]
    });
  }

  get categoriesFormArray(): FormArray {
    return this.uploadForm.get('categories') as FormArray;
  }

  goBack(): void {
    this.location.back();
  }

  onPreview(): void {
    const selectedCategories = this.uploadForm.value.categories
      .map((selected: boolean, index: number) => (selected ? this.categoriesList[index] : null))
      .filter((category: string | null) => category !== null);

    this.previewData = {
      title: this.uploadForm.value.title || 'No Title',
      categories: selectedCategories,
      textContent: this.uploadForm.value.content,
      files: [...this.images, ...this.videos]
    };
    this.previewMode = true;
  }

  exitPreview(): void {
    this.previewMode = false;
  }

  /**
   * Determines if a file is an image based on its extension.
   */
  isImage(fileName: string): boolean {
    return /\.(jpeg|jpg|png|gif)$/i.test(fileName);
  }

  /**
   * Creates a local preview URL for an uploaded file.
   */
  getFileUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  onFileSelected(event: any, type: 'image' | 'video') {
    const files = Array.from(event.target.files) as File[];
    if (type === 'image') {
      this.images.push(...files);
    } else {
      this.videos.push(...files);
    }
  }

  async uploadFile(file: File, filePath: string): Promise<string> {
    try {
      const fileRef = ref(this.storage, filePath);
      await uploadBytes(fileRef, file);
      return getDownloadURL(fileRef);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async onUpload() {
    if (this.uploadForm.invalid) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const postId = uuidv4();

      // Upload images
      const imageUploadPromises = this.images.map((image) =>
        this.uploadFile(image, `posts/${postId}/images/${image.name}`)
      );

      // Upload videos
      const videoUploadPromises = this.videos.map((video) =>
        this.uploadFile(video, `posts/${postId}/videos/${video.name}`)
      );

      // Wait for all uploads to complete
      const [imageUrls, videoUrls] = await Promise.all([
        Promise.all(imageUploadPromises),
        Promise.all(videoUploadPromises)
      ]);

      // Get selected categories
      const selectedCategories = this.uploadForm.value.categories
        .map((selected: boolean, index: number) => (selected ? this.categoriesList[index] : null))
        .filter((category: string | null) => category !== null);

      // Prepare post data
      const post = {
        id: postId,
        title: this.uploadForm.value.title,
        content: this.uploadForm.value.content,
        categories: selectedCategories,
        images: imageUrls,
        videos: videoUrls,
        createdAt: Timestamp.now(),
        views: 0,
        likes: 0
      };

      // Save post to Firestore
      const postCollection = collection(this.firestore, 'posts');
      await addDoc(postCollection, post);

      // Reset form & files
      this.uploadForm.reset();
      this.images = [];
      this.videos = [];

      alert('Post uploaded successfully!');
    } catch (error) {
      console.error("Failed to upload post:", error);
      alert('Error uploading post. Please try again.');
    }
  }
}
