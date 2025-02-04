import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { QuillModule, QuillEditorComponent } from 'ngx-quill';
import { DomSanitizer } from '@angular/platform-browser';
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
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-upload-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    QuillModule,
    CommonModule,
    SafeHtmlPipe,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    
  ],
  templateUrl: './upload-post.component.html',
  styleUrls: ['./upload-post.component.css']
})
export class UploadPostComponent implements OnInit {
  readonly categoriesList: string[] = ['News', 'Sports', 'Tech', 'Business'];
  currentDate = new Date();
  uploadForm!: FormGroup;
  previewMode: boolean = false;
  previewData: any = {
    title: '',
    categories: [],
    textContent: '',
    files: []
  };

  // File arrays for images and videos
  images: File[] = [];
  videos: File[] = [];

  // ViewChild referencing #quillEditor from the template
  @ViewChild('quillEditor') quillEditor!: QuillEditorComponent;

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private sanitizer: DomSanitizer,
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
    // Convert the boolean array to a list of selected category names
    const selectedCategories = this.uploadForm.value.categories
      .map((selected: boolean, index: number) => (selected ? this.categoriesList[index] : null))
      .filter((category: string | null) => category !== null);

    this.previewData = {
      title: this.uploadForm.value.title || 'No Title',
      categories: selectedCategories,
      textContent: this.uploadForm.value.content, // or quillEditor.quillEditor.root.innerHTML
      files: [...this.images, ...this.videos]
    };

    this.previewMode = true;
  }

  exitPreview(): void {
    this.previewMode = false;
  }

  isImage(fileName: string): boolean {
    return /\.(jpeg|jpg|png|gif)$/i.test(fileName);
  }

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

  async onUpload() {
    if (this.uploadForm.valid) {
      const postId = uuidv4();

      // Arrays to store the URLs after upload
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];

      // We'll store our upload promises here
      const storagePromises: Promise<void>[] = [];

      // Upload images
      for (const image of this.images) {
        const imageRef = ref(this.storage, `posts/${postId}/images/${image.name}`);
        const uploadPromise = uploadBytes(imageRef, image)
          .then(() => {
            // Return a promise that resolves when the download URL is retrieved
            return getDownloadURL(imageRef).then(url => {
              // We do NOT return the result of push() (which would be a number)
              imageUrls.push(url);
            });
          });
        storagePromises.push(uploadPromise);
      }

      // Upload videos
      for (const video of this.videos) {
        const videoRef = ref(this.storage, `posts/${postId}/videos/${video.name}`);
        const uploadPromise = uploadBytes(videoRef, video)
          .then(() => {
            return getDownloadURL(videoRef).then(url => {
              videoUrls.push(url);
            });
          });
        storagePromises.push(uploadPromise);
      }

      // Wait for all uploads to finish
      await Promise.all(storagePromises);

      // Collect the selected categories
      const selectedCategories = this.uploadForm.value.categories
        .map((selected: boolean, index: number) => (selected ? this.categoriesList[index] : null))
        .filter((category: string | null) => category !== null);

      // Add document to Firestore
      const postCollection = collection(this.firestore, 'posts');
      await addDoc(postCollection, {
        id: postId,
        title: this.uploadForm.value.title,
        // Or retrieve from Quill Editor directly:
        content: this.quillEditor.quillEditor.root.innerHTML,
        categories: selectedCategories,
        images: imageUrls,
        videos: videoUrls,
        createdAt: Timestamp.now(),
        views: 0,
        likes: 0
      });

      // Reset form and arrays
      this.uploadForm.reset();
      this.images = [];
      this.videos = [];

      alert('Post uploaded successfully!');
    }
  }
}
