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

  // This will hold the grouped posts (like your original "categories" array).
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
        this.allPosts = [...posts]; // copy to local array

        // Add a 'thumbnailUrl' for each post, randomly picking from images[]
        this.allPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
            const randomIndex = Math.floor(Math.random() * post.images.length);
            post.thumbnailUrl = post.images[randomIndex];
          } else {
            post.thumbnailUrl = '/assets/placeholder.jpg';
          }
        });

        // Now apply the category filter/group
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
   * (This assumes we don't want to re-fetch from Firestore every time.)
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategory'] && !changes['selectedCategory'].isFirstChange()) {
      this.applyCategoryFilter();
    }
  }

  /**
   * Filter or group posts according to the selectedCategory.
   */
  private applyCategoryFilter(): void {
    if (this.allPosts.length === 0) {
      this.groupedCategories = [];
      return;
    }

    if (this.selectedCategory === 'All') {
      this.groupedCategories = this.groupByCategory(this.allPosts);
    } else {
      const filtered = this.allPosts.filter(p =>
        p.categories.includes(this.selectedCategory)
      );
      this.groupedCategories = [{
        tag: this.selectedCategory,
        posts: filtered
      }];
    }
  }

  /**
   * Group posts by each category they belong to.
   * If a post can have multiple categories, it appears in multiple groups.
   */
  private groupByCategory(posts: Post[]): Array<{ tag: string; posts: Post[] }> {
    const catMap: Map<string, Post[]> = new Map();

    posts.forEach(post => {
      post.categories.forEach(cat => {
        if (!catMap.has(cat)) {
          catMap.set(cat, []);
        }
        catMap.get(cat)!.push(post);
      });
    });

    // Convert catMap to an array of objects with { tag, posts }
    const result: Array<{ tag: string; posts: Post[] }> = [];
    for (const [tag, psts] of catMap.entries()) {
      result.push({ tag, posts: psts });
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

  openDetailDialog(post: Post): void {
    this.dialog.open(PostDetailComponent, {
      width: '80vw',
      maxWidth: '1000px',
      data: { post },
      panelClass: 'post-detail-dialog'
    });
  }
}
