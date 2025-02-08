// main.component.ts
import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostService, Post } from '../../services/post.service';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,  // Ensure MatDialogModule is imported if you're using MatDialog
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

  constructor(
    private postService: PostService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Immediately check for the query parameter so the overlay can be loaded faster.
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const docId = params.get('post');
      if (docId) {
        this.overlayOpened = true; // Mark overlay as being opened
        // Fetch the post immediately by its document ID.
        this.postService.getPostById(docId).pipe(take(1)).subscribe({
          next: (post) => {
            if (post) {
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

        // Add a 'thumbnailUrl' for each post by randomly selecting one from images[].
        this.allPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
            const randomIndex = Math.floor(Math.random() * post.images.length);
            post.thumbnailUrl = post.images[randomIndex];
          } else {
            post.thumbnailUrl = '/assets/placeholder.jpg';
          }
        });

        // Apply the category filter/group logic.
        this.applyCategoryFilter();

        // As a backup: if no overlay has been opened yet and the query parameter exists,
        // try to find the post in the loaded posts.
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
   * Apply the filter/group logic:
   * - If "All" => group by category, show 8 newest per category.
   * - Else => show all posts in the chosen category, sorted newest-first.
   */
  private applyCategoryFilter(): void {
    if (this.allPosts.length === 0) {
      this.groupedCategories = [];
      return;
    }

    if (this.selectedCategory === 'All') {
      // Group all posts by category, limiting each category to 8 posts.
      this.groupedCategories = this.groupByCategory(this.allPosts, 8);
    } else {
      // Show only posts in the selected category (no limit), sorted newest first.
      const filtered = this.allPosts.filter(post =>
        post.categories.includes(this.selectedCategory)
      );
      filtered.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        // If using Firestore Timestamp, convert to milliseconds:
        return b.createdAt.toMillis() - a.createdAt.toMillis();
      });
      // Create one group for the selected category.
      this.groupedCategories = [{
        tag: this.selectedCategory,
        posts: filtered
      }];
    }
  }

  /**
   * Groups posts by each category, sorts them newest-first,
   * and optionally limits how many posts to keep per category.
   *
   * @param posts Array of posts to be grouped.
   * @param limit Optional number to limit posts per category (e.g. 8). If not provided, no limit.
   */
  private groupByCategory(posts: Post[], limit?: number): Array<{ tag: string; posts: Post[] }> {
    const catMap = new Map<string, Post[]>();

    // Build a map: category -> array of posts.
    posts.forEach(post => {
      post.categories.forEach(cat => {
        if (!catMap.has(cat)) {
          catMap.set(cat, []);
        }
        catMap.get(cat)!.push(post);
      });
    });

    // Convert the map into an array and sort posts within each category.
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

  // TrackBy functions for performance with *ngFor.
  trackById(index: number, item: Post) {
    return item.id;
  }

  trackByTag(index: number, group: { tag: string; posts: Post[] }) {
    return group.tag;
  }

  /**
   * Opens a dialog with post details.
   */
  openDetailDialog(post: Post): void {
    // Optionally, check if a dialog is already open.
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
   * Backup method: Checks the URL's query parameters for a "post" parameter.
   * If found, attempts to locate the post in the loaded posts and opens the overlay dialog.
   * Uses `take(1)` so that the subscription only fires once.
   */
  private checkQueryParamsForPost(): void {
    this.route.queryParamMap.pipe(take(1)).subscribe(params => {
      const docId = params.get('post');
      if (docId) {
        // Mark that the overlay is being opened.
        this.overlayOpened = true;
        // Try to locate the post in the already loaded posts.
        const foundPost = this.allPosts.find(post => post.docId === docId);
        if (foundPost) {
          this.openDetailDialog(foundPost);
        }
      }
    });
  }
}
