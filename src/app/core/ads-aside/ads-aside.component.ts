import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-ads-aside',
  standalone: true,
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './ads-aside.component.html',
  styleUrls: ['./ads-aside.component.css']
})
export class AdsAsideComponent implements OnInit {
  randomPost: any;

  constructor(private postService: PostService) {}

  ngOnInit() {
    // Subscribe to the posts observable.
    this.postService.posts$.subscribe((posts) => {
      if (posts.length > 0) {
        const randomIndex = Math.floor(Math.random() * posts.length);
        this.randomPost = posts[randomIndex];
      }
    });
  }
}