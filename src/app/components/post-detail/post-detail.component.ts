import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtmlPipe } from 'C:/Users/teoto/News_3_Classic/src/app/pipes/safehtml.pipe'; // adjust path as needed
import { Post } from 'C:/Users/teoto/News_3_Classic/src/app/services/post.service'; // adjust path if needed

interface Comment {
  name: string;
  message: string;
}

@Component({
  selector: 'app-post-detail',
  standalone: true,
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    SafeHtmlPipe,
    // If you prefer standalone DatePipe usage instead of CommonModule's built-in:
    // DatePipe,
  ]
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;

  // For comments
  comments: Comment[] = [];
  commentName = '';
  commentMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private dialogRef: MatDialogRef<PostDetailComponent>
  ) {}

  ngOnInit(): void {
    if (this.data?.post) {
      this.post = this.data.post;
      // If your post doc includes a comments array, load it here or from Firestore
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  /**
   * Fix for error: 'Property 'onShare' does not exist.'
   */
  onShare(): void {
    // Your share logic, e.g.:
    alert('Sharing post...');
  }

  /**
   * Add a comment to the comments array. 
   * In a real app, you'd likely store it to Firestore or server.
   */
  addComment(): void {
    if (!this.commentName.trim() || !this.commentMessage.trim()) {
      return; // Basic validation
    }

    this.comments.push({
      name: this.commentName.trim(),
      message: this.commentMessage.trim()
    });

    this.commentName = '';
    this.commentMessage = '';
  }
}
