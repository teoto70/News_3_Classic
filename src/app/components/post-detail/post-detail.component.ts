import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtmlPipe } from '../../pipes/safehtml.pipe'; // adjust path as needed
import { Post } from '../../services/post.service'; // adjust path if needed
import { doc, updateDoc, increment, getDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { shareIcons } from 'ngx-sharebuttons/icons';
import { provideShareButtonsOptions } from 'ngx-sharebuttons';


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
    // provideShareButtonsOptions
  ]
})
export class PostDetailComponent implements OnInit {
  // We assume that the Post object now has a "docId" property that contains
  // the actual Firestore document ID.
  post: Post | null = null;

  // For comments
  //comments: Comment[] = [];
  //commentName = '';
  //commentMessage = '';//

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private firestore: Firestore,
    private dialogRef: MatDialogRef<PostDetailComponent>
  ) {}

  ngOnInit(): void {
    if (this.data?.post) {
      this.post = this.data.post;
      // Increment views when the component loads
      this.incrementViews();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onShare(): void {
    alert('Sharing post...');
  }

 //addComment(): void {
   // if (!this.commentName.trim() || !this.commentMessage.trim()) return;
   // this.comments.push({
   //   name: this.commentName.trim(),
   //   message: this.commentMessage.trim()
   // });
   // this.commentName = '';
   // this.commentMessage = '';
 // }

  // ----------------------------
  // 1) VIEWS
  // ----------------------------
  private async incrementViews(): Promise<void> {
    if (!this.post?.docId) return;
  
    const docId = this.post.docId.trim();
    const postRef = doc(this.firestore, 'posts', docId);
    console.log('Updating views at:', postRef.path);
  
    try {
      const docSnap = await getDoc(postRef);
      if (!docSnap.exists()) {
        console.warn(`Document ${docId} not found. Cannot update views.`);
        return;
      }
      await updateDoc(postRef, { views: increment(1) });
      this.post.views = (this.post.views ?? 0) + 1;
      console.log('Views incremented for', docId);
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  // ----------------------------
  // 2) LIKES
  // ----------------------------
  async onLikeClick(): Promise<void> {
    if (!this.post?.docId) return;

    const docId = this.post.docId.trim();
    const postRef = doc(this.firestore, 'posts', docId);
    console.log('Updating likes at:', postRef.path);

    try {
      const docSnap = await getDoc(postRef);
      if (!docSnap.exists()) {
        console.warn(`Document ${docId} not found. Cannot update likes.`);
        return;
      }
      await updateDoc(postRef, { likes: increment(1) });
      this.post.likes = (this.post.likes ?? 0) + 1;
      console.log('Likes incremented for', docId);
    } catch (error) {
      console.error('Error incrementing likes:', error);
    }
  }

  // ----------------------------
  // 3) SHARE
  // ----------------------------
  shareFacebook(event: Event): void {
    event.preventDefault();
    if (!this.post) return;
    const shareUrl = this.buildPostURL();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener');
  }

  shareTwitter(event: Event): void {
    event.preventDefault();
    if (!this.post) return;
    const shareUrl = this.buildPostURL();
    const text = encodeURIComponent(`Check out this post: ${this.post.title}`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(twitterUrl, '_blank', 'noopener');
  }

  shareLinkedIn(event: Event): void {
    event.preventDefault();
    if (!this.post) return;
    const shareUrl = this.buildPostURL();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener');
  }

  private buildPostURL(): string {
    const domain = 'https://news3-57830--news3-57830.europe-west4.hosted.app/'; // Replace with your domain
    // Use the Firestore docId for building the URL if desired
    return `${domain}/post/${this.post?.docId}`;
  }
}
