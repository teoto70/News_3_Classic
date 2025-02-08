// src/app/components/post-detail/post-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SafeHtmlPipe } from '../../pipes/safehtml.pipe';
import { Post } from '../../services/post.service';
import { doc, updateDoc, increment, getDoc } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule, // For navigation (Back button)
    FormsModule,
    SafeHtmlPipe
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post!: Post;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private titleService: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    // Retrieve the post data from the route resolver (or parameter).
    this.post = this.route.snapshot.data['post'];
    if (this.post) {
      this.incrementViews();
      this.updateMetaTags();
    } else {
      console.warn('No post data available.');
    }
  }

  async onLikeClick(): Promise<void> {
    if (!this.post?.docId) return;
    const docId = this.post.docId.trim();
    const postRef = doc(this.firestore, 'posts', docId);
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

  private async incrementViews(): Promise<void> {
    if (!this.post?.docId) return;
    const docId = this.post.docId.trim();
    const postRef = doc(this.firestore, 'posts', docId);
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

  private updateMetaTags(): void {
    if (!this.post) return;
    // Update the document title.
    this.titleService.setTitle(this.post.title);
    // Use the first image in the images array as the thumbnail.
    const thumbnail = (this.post.images && this.post.images.length > 0) ? this.post.images[0] : '/assets/placeholder.jpg';
    // Update Open Graph meta tags.
    this.meta.updateTag({ property: 'og:title', content: this.post.title });
    this.meta.updateTag({ property: 'og:image', content: thumbnail });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    // Update Twitter Card meta tags.
    this.meta.updateTag({ name: 'twitter:title', content: this.post.title });
    this.meta.updateTag({ name: 'twitter:image', content: thumbnail });
    // Optionally update a description using a snippet from the content.
    this.meta.updateTag({ property: 'og:description', content: this.extractDescription(this.post.content) });
  }

  private extractDescription(content: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    return tempDiv.textContent?.trim().slice(0, 160) || '';
  }

  /**
   * Navigates back to the main view.
   */
  goBack(): void {
    this.router.navigate(['']);
  }

  // Social sharing functions:
  shareFacebook(event: Event): void {
    event.preventDefault();
    const shareUrl = this.buildPostURL();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'noopener');
  }

  shareTwitter(event: Event): void {
    event.preventDefault();
    const shareUrl = this.buildPostURL();
    const text = encodeURIComponent(`Check out this post: ${this.post.title}`);
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${text}`;
    window.open(twitterUrl, '_blank', 'noopener');
  }

  shareLinkedIn(event: Event): void {
    event.preventDefault();
    const shareUrl = this.buildPostURL();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener');
  }

  copyLink(event: Event): void {
    event.preventDefault();
    const shareUrl = this.buildPostURL();
    navigator.clipboard.writeText(shareUrl)
      .then(() => alert('Link copied to clipboard!'))
      .catch(err => console.error('Failed to copy link: ', err));
  }

  private buildPostURL(): string {
    const domain = window.location.origin;
    return `${domain}/post/${this.post?.docId}`;
  }
}
