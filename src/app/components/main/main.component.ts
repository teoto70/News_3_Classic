// src/app/components/main/main.component.ts
import { Component, OnInit, OnChanges, Input, SimpleChanges, Inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { PostService, Post } from '../../services/post.service';
import { PostDetailComponent } from '../post-detail/post-detail.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,       // Provides ActivatedRoute at runtime
    MatDialogModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges {
  @Input() selectedCategory: string = 'All';

  groupedCategories: Array<{ tag: string; posts: Post[] }> = [];
  isLoading = false;
  allPosts: Post[] = [];
  // Flag to prevent multiple overlay openings
  private overlayOpened: boolean = false;

  // Use the @Inject decorator with forwardRef to inject ActivatedRoute.
  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    @Inject(forwardRef(() => ActivatedRoute)) private route: ActivatedRoute,
    private titleService: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    // Immediately check for the "post" query parameter so the overlay can be loaded faster.
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const docId = params.get('post');
      if (docId) {
        this.overlayOpened = true; // Mark that the overlay will be opened.
        // Fetch the specific post by its document ID.
        this.postService.getPostById(docId).pipe(take(1)).subscribe({
          next: (post) => {
            if (post) {
              // Update meta tags for social media previews.
              this.titleService.setTitle(post.title);
              const thumbnail = post.thumbnailUrl ||
                (post.images && post.images.length > 0 ? post.images[0] : '/assets/placeholder.jpg');
              this.meta.updateTag({ property: 'og:title', content: post.title });
              this.meta.updateTag({ property: 'og:image', content: thumbnail });
              this.meta.updateTag({ name: 'twitter:title', content: post.title });
              this.meta.updateTag({ name: 'twitter:image', content: thumbnail });
              // Open the overlay to display the post.
              this.openDetailDialog(post);
            } else {
              console.warn('Post not found for docId:', docId);
            }
          },
          error: (err) => console.error('Error fetching post by docId:', err)
        });
      }
    });

    // Load all posts for the main page.
    this.isLoading = true;
    this.postService.loadPosts();

    // Subscribe to posts$ to get the updated list of posts.
    this.postService.posts$.subscribe({
      next: (posts) => {
        this.isLoading = false;
        this.allPosts = [...posts];

        // For each post, assign a thumbnailUrl if available.
        this.allPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
            const randomIndex = Math.floor(Math.random() * post.images.length);
            post.thumbnailUrl = post.images[randomIndex];
          } else {
            post.thumbnailUrl = '/assets/placeholder.jpg';
          }
        });

        // Apply category filtering and grouping.
        this.applyCategoryFilter();

        // Backup: if no overlay has been opened yet and a query parameter exists,
        // try to locate the post in the loaded posts.
        if (!this.overlayOpened) {
          this.checkQueryParamsForPost();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching posts:', err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory'] && !changes['selectedCategory'].isFirstChange()) {
      this.applyCategoryFilter();
    }
  }

  /**
   * Applies filtering and grouping of posts by category.
   */
  private applyCategoryFilter(): void {
    if (this.allPosts.length === 0) {
      this.groupedCategories = [];
      return;
    }
    if (this.selectedCategory === 'All') {
      this.groupedCategories = this.groupByCategory(this.allPosts, 8);
    } else {
      const filtered = this.allPosts.filter(post =>
        post.categories.includes(this.selectedCategory)
      );
      filtered.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      this.groupedCategories = [{
        tag: this.selectedCategory,
        posts: filtered
      }];
    }
  }

  /**
   * Groups posts by category, optionally limiting the number per category.
   */
  private groupByCategory(posts: Post[], limit?: number): Array<{ tag: string; posts: Post[] }> {
    const catMap = new Map<string, Post[]>();
    posts.forEach(post => {
      post.categories.forEach(cat => {
        if (!catMap.has(cat)) {
          catMap.set(cat, []);
        }
        catMap.get(cat)!.push(post);
      });
    });
    const result: Array<{ tag: string; posts: Post[] }> = [];
    for (const [tag, psts] of catMap.entries()) {
      psts.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      const limitedPosts = limit ? psts.slice(0, limit) : psts;
      result.push({ tag, posts: limitedPosts });
    }
    return result;
  }

  // TrackBy functions for *ngFor performance.
  trackById(index: number, item: Post): any {
    return item.id;
  }
  trackByTag(index: number, group: { tag: string; posts: Post[] }): any {
    return group.tag;
  }

  /**
   * Opens a dialog (overlay) with the post details.
   */
  openDetailDialog(post: Post): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }
    this.dialog.open(PostDetailComponent, {
      width: '80vw',
      maxWidth: '1000px',
      data: { post },
      panelClass: 'post-detail-dialog'
    });
  }

  /**
   * Backup method: If a "post" query parameter exists, attempt to find the post in the loaded posts.
   */
  private checkQueryParamsForPost(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const docId = params.get('post');
      if (docId) {
        this.overlayOpened = true;
        const foundPost = this.allPosts.find(post => post.docId === docId);
        if (foundPost) {
          this.openDetailDialog(foundPost);
        }
      }
    });
  }
}
