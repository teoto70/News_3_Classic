import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true, // Mark as standalone
  imports: [CommonModule], // Import CommonModule for *ngFor and other directives
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  categories: any[] = []; // Array to hold grouped posts by category
  isLoading = false; // Loading state
  currentPage = 1; // Pagination (if needed)

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit() {
    this.fetchNews(); // Fetch data when the component initializes
  }

  fetchNews() {
    if (this.isLoading) return; // Prevent multiple requests

    this.isLoading = true; // Set loading state
    const apiUrl = `https://jsonplaceholder.typicode.com/photos?_page=${this.currentPage}&_limit=10`;

    // Make the API request
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        console.log('Data received:', data); // Debugging: Log the data
        this.categories = this.groupByCategory(data); // Group data by category
        this.isLoading = false; // Reset loading state
        this.currentPage++; // Increment page for pagination
      },
      error: (error) => {
        console.error('Error fetching data:', error); // Log errors
        this.isLoading = false; // Reset loading state
      }
    });
  }

  groupByCategory(articles: any[]) {
    // Group articles by category (mock logic)
    const categoriesMap = new Map<string, any[]>();
    articles.forEach(article => {
      const category = `Category ${Math.floor(Math.random() * 3) + 1}`; // Mock categories
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, []);
      }
      categoriesMap.get(category)!.push(article);
    });

    return Array.from(categoriesMap.entries()).map(([tag, posts]) => ({
      tag,
      posts
    }));
  }
}