// src/app/components/main/main.component.ts
import { Component, OnInit, OnChanges, Input, SimpleChanges, Inject, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { Title, Meta } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { PostService, Post } from '../../services/post.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,       // Provides ActivatedRoute and Router at runtime
    MatDialogModule     // (Optional if you need dialog features elsewhere)
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
    private router: Router, // Router is injected for navigation
    @Inject(forwardRef(() => ActivatedRoute)) private route: ActivatedRoute,
    private titleService: Title,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.loadPosts();

    this.postService.posts$.subscribe({
      next: (posts) => {
        this.isLoading = false;
        this.allPosts = [...posts];

        // For each post, assign a thumbnailUrl if available.
        this.allPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
            // Here we use the first image as the thumbnail (or use post.thumbnailUrl if available)
            post.thumbnailUrl = post.thumbnailUrl || post.images[0];
          } else {
            post.thumbnailUrl = '/assets/placeholder.jpg';
          }
        });

        this.applyCategoryFilter();
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
   * Groups posts by category, optionally limiting the number per group.
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

  /**
   * TrackBy functions for performance.
   */
  trackById(index: number, item: Post): any {
    return item.id;
  }
  trackByTag(index: number, group: { tag: string; posts: Post[] }): any {
    return group.tag;
  }

  /**
   * Navigates to the dedicated Post Detail route.
   */
  openPostDetail(post: Post): void {
    this.router.navigate(['/post', post.docId]);
  }
}
