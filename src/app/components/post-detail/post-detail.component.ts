// src/app/components/post-detail/post-detail.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SafeHtmlPipe } from '../../pipes/safehtml.pipe';
import { Post } from '../../services/post.service';
import { doc, updateDoc, increment, getDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { shareIcons } from 'ngx-sharebuttons/icons';
import { provideShareButtonsOptions } from 'ngx-sharebuttons';
// Import Angular services for updating meta tags
import { Meta, Title } from '@angular/platform-browser';

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
  post: Post | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private firestore: Firestore,
    private dialogRef: MatDialogRef<PostDetailComponent>,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    if (this.data?.post) {
      this.post = this.data.post;
      // Increment views when the component loads
      this.incrementViews();

      // Update the document title and meta tags for social sharing
      this.updateMetaTags();
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onShare(): void {
    alert('Sharing post...');
  }

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
  // 3) SHARE (Social Media)
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

  // ----------------------------
  // 4) COPY LINK TO CLIPBOARD
  // ----------------------------
  copyLink(event: Event): void {
    event.preventDefault();
    if (!this.post) return;
    const shareUrl = this.buildPostURL();
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy link: ', err);
      });
  }

  // ----------------------------
  // URL Builder
  // ----------------------------
  private buildPostURL(): string {
    const domain = window.location.origin;
    // Example using the Query Parameter Approach:
    return `${domain}/?post=${this.post?.docId}`;
  }

  // ----------------------------
  // META TAG UPDATE
  // ----------------------------
  private updateMetaTags(): void {
    if (!this.post) {
      return;
    }

    // Update the document title
    this.titleService.setTitle(this.post.title);

    // Update Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: this.post.title });
    const thumbnail = this.post.thumbnailUrl || '/assets/placeholder.jpg';
    this.meta.updateTag({ property: 'og:image', content: thumbnail });
    // Specify image dimensions to ensure the image is processed correctly.
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });

    // Update Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:title', content: this.post.title });
    this.meta.updateTag({ name: 'twitter:image', content: thumbnail });
  }

  /**
   * Extracts a plain-text snippet from HTML content to use as a description.
   */
  private extractDescription(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent?.trim().slice(0, 160) || '';
  }
}
