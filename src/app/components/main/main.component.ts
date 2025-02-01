import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnChanges {
  // Receive the selected category from the parent.
  @Input() selectedCategory: string = 'All';

  // Use a single property to store either grouped categories (for "All")
  // or a single group of posts (for a specific category).
  categories: any[] = [];

  isLoading = false;
  currentPage = 1;

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    // When the selected category changes, reset and re-fetch posts.
    if (changes['selectedCategory']) {
      this.currentPage = 1;
      this.categories = [];
      this.fetchNews();
    }
  }

  /**
   * Fetch posts from the API.
   * Each post is assigned a category (skipping "All").
   * If selectedCategory is "All", group posts by category.
   * Otherwise, filter posts to include only those matching the selected category.
   */
  fetchNews(): void {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    const apiUrl = `https://jsonplaceholder.typicode.com/photos?_page=${this.currentPage}&_limit=24`;

    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        // Assign a category to each post.
        // Since categoriesList in the header includes "All" at index 0,
        // we use the remaining items for assignment.
        const actualCategories = ['News', 'Sports', 'Tech', 'Business', 'Contact'];
        data.forEach(post => {
          post.category = actualCategories[(post.id - 1) % actualCategories.length];
        });

        if (this.selectedCategory === 'All') {
          // Group posts by category.
          this.categories = this.groupByCategory(data);
        } else {
          // Filter posts for the selected category and wrap in a single group.
          const filtered = data.filter(post => post.category === this.selectedCategory);
          this.categories = [{
            tag: this.selectedCategory,
            posts: filtered
          }];
        }
        this.isLoading = false;
        this.currentPage++;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Groups an array of posts by their category.
   * Ensures every category appears (even if empty) and pads each group to 8 posts.
   */
  groupByCategory(posts: any[]): any[] {
    // Define the actual categories (excluding "All").
    const actualCategories = ['News', 'Sports', 'Tech', 'Business', 'Contact'];
    const categoriesMap = new Map<string, any[]>();
    actualCategories.forEach(cat => categoriesMap.set(cat, []));

    // Place posts into the correct category group.
    posts.forEach(post => {
      const category = post.category;
      if (categoriesMap.has(category)) {
        categoriesMap.get(category)!.push(post);
      } else {
        categoriesMap.set(category, [post]);
      }
    });

    // Ensure each group has exactly 8 posts.
    const grouped = Array.from(categoriesMap.entries()).map(([tag, posts]) => {
      if (posts.length < 8) {
        while (posts.length < 8) {
          posts.push({
            id: posts.length + 1,
            title: `Mock Post ${posts.length + 1}`,
            thumbnailUrl: `https://via.placeholder.com/150?text=Mock+Post+${posts.length + 1}`,
            category: tag
          });
        }
      } else if (posts.length > 8) {
        posts = posts.slice(0, 8);
      }
      return { tag, posts };
    });

    return grouped;
  }

  // Optionally, a trackBy function to optimize ngFor rendering.
  trackById(index: number, item: any): any {
    return item.tag || item.id;
  }
}
