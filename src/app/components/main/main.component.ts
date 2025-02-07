import { Component, OnChanges, OnInit, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PostService, Post } from '../../services/post.service';
import { PostDetailComponent } from '../post-detail/post-detail.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,  // ensure MatDialogModule is imported if you're using MatDialog
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnChanges {
  @Input() selectedCategory: string = 'All';

  groupedCategories: Array<{ tag: string; posts: Post[] }> = [];
  isLoading = false;
  allPosts: Post[] = [];

  constructor(
    private postService: PostService,
    private dialog: MatDialog
  ) {}

  /**
   * OnInit: Load posts once, then subscribe to them via posts$.
   */
  ngOnInit(): void {
    this.isLoading = true;

    // 1) Trigger the service to fetch from Firestore and emit to posts$
    this.postService.loadPosts();

    // 2) Subscribe to posts$ to get the updated list of posts
    this.postService.posts$.subscribe({
      next: (posts) => {
        this.isLoading = false;
        this.allPosts = [...posts];

        // Add a 'thumbnailUrl' for each post, randomly picking from images[]
        this.allPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
            const randomIndex = Math.floor(Math.random() * post.images.length);
            post.thumbnailUrl = post.images[randomIndex];
          } else {
            post.thumbnailUrl = '/assets/placeholder.jpg';
          }
        });

        // Apply the category filter/group
        this.applyCategoryFilter();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching posts:', err);
      }
    });
  }

  /**
   * OnChanges: Re-group or re-filter whenever the @Input() selectedCategory changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory'] && !changes['selectedCategory'].isFirstChange()) {
      this.applyCategoryFilter();
    }
  }

  /**
   * Apply the filter/group logic:
   * - If "All" => group by category, show 8 newest per category
   * - Else => show all posts in the chosen category, sorted newest-first (no limit)
   */
  private applyCategoryFilter(): void {
    if (this.allPosts.length === 0) {
      this.groupedCategories = [];
      return;
    }

    if (this.selectedCategory === 'All') {
      // Group all posts by category, limit each category to 8
      this.groupedCategories = this.groupByCategory(this.allPosts, 8);
    } else {
      // Show only posts in the selected category (no limit),
      // but sorted by newest first
      const filtered = this.allPosts.filter(post =>
        post.categories.includes(this.selectedCategory)
      );
      // Sort by newest first
      filtered.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        // Firestore Timestamp version:
        return b.createdAt.toMillis() - a.createdAt.toMillis();

        // If numeric timestamp:
        // return b.createdAt - a.createdAt;
      });
      // One single group
      this.groupedCategories = [{
        tag: this.selectedCategory,
        posts: filtered
      }];
    }
  }

  /**
   * Group posts by each category, sort them newest-first,
   * and optionally limit how many posts to keep per category.
   *
   * @param posts Array of posts to be grouped
   * @param limit Optional number to limit posts per category (e.g. 8). If not provided, no limit.
   */
  private groupByCategory(posts: Post[], limit?: number): Array<{ tag: string; posts: Post[] }> {
    const catMap = new Map<string, Post[]>();

    // 1. Build a map: category -> array of posts
    posts.forEach(post => {
      post.categories.forEach(cat => {
        if (!catMap.has(cat)) {
          catMap.set(cat, []);
        }
        catMap.get(cat)!.push(post);
      });
    });

    // 2. Convert to an array and sort each category's posts by newest first
    const result: Array<{ tag: string; posts: Post[] }> = [];
    for (const [tag, psts] of catMap.entries()) {
      psts.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0;
        // If using Firestore Timestamp:
        return b.createdAt.toMillis() - a.createdAt.toMillis();

        // If numeric:
        // return b.createdAt - a.createdAt;
      });

      // Limit to `limit` if provided
      const limitedPosts = limit ? psts.slice(0, limit) : psts;

      result.push({ tag, posts: limitedPosts });
    }

    return result;
  }

  // TrackBy functions for performance in *ngFor
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
    this.dialog.open(PostDetailComponent, {
      width: '80vw',
      maxWidth: '1000px',
      data: { post },
      panelClass: 'post-detail-dialog'
    });
  }
}
