import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  categories: any[] = [];
  isLoading = false;
  currentPage = 1;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchNews();
  }

  fetchNews() {
    if (this.isLoading) return;

    this.isLoading = true;
    const apiUrl = `https://jsonplaceholder.typicode.com/photos?_page=${this.currentPage}&_limit=24`; // Fetch 24 posts

    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        console.log('Data received:', data);
        this.categories = this.groupByCategory(data);
        this.isLoading = false;
        this.currentPage++;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      }
    });
  }

  groupByCategory(articles: any[]) {
    const categoriesMap = new Map<string, any[]>();

    // Group posts by category (random assignment)
    articles.forEach(article => {
      const category = `Category ${Math.floor(Math.random() * 3) + 1}`;
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      categoriesMap.get(category)!.push(article);
    });

    // Ensure each category has exactly 8 posts
    const result = Array.from(categoriesMap.entries()).map(([tag, posts]) => {
      if (posts.length < 8) {
        // Pad with mock posts if fewer than 8
        while (posts.length < 8) {
          posts.push({
            id: posts.length + 1,
            title: `Mock Post ${posts.length + 1}`,
            thumbnailUrl: `https://via.placeholder.com/150?text=Mock+Post+${posts.length + 1}`,
            category: tag
          });
        }
      } else if (posts.length > 8) {
        // Trim the posts array if more than 8
        posts = posts.slice(0, 8);
      }
      return { tag, posts };
    });

    return result;
  }
}
