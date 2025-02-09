import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Added Router here
import { PostService, Post } from '../../services/post.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  selectedCategory: string = 'All';
  groupedCategories: Array<{ tag: string; posts: Post[] }> = [];
  isLoading = false;
  allPosts: Post[] = [];

  constructor(private route: ActivatedRoute, private postService: PostService, private router: Router) {} // Added router injection

  ngOnInit(): void {
    // Subscribe to the route parameter to get the selected category.
    this.route.paramMap.subscribe(params => {
      this.selectedCategory = params.get('selectedCategory') || 'All';
      console.log('Main component selected category:', this.selectedCategory);
      this.applyCategoryFilter();
    });

    // Load posts
    this.isLoading = true;
    this.postService.loadPosts();
    this.postService.posts$.subscribe({
      next: (posts) => {
        this.isLoading = false;
        this.allPosts = [...posts];

        // Assign a thumbnail if available, or a placeholder.
        this.allPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
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

  // TrackBy functions for ngFor performance
  trackById(index: number, item: Post): any {
    return item.id;
  }
  trackByTag(index: number, group: { tag: string; posts: Post[] }): any {
    return group.tag;
  }

  // Updated openPostDetail method to navigate to the post detail page
  openPostDetail(post: Post): void {
    if (post.docId) {
      this.router.navigate(['/post', post.docId]);
    } else {
      console.error('Post document ID is missing');
    }
  }
}
