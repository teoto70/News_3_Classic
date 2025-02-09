import { Component, OnInit } from '@angular/core';
import { PostService, Post } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ads-aside',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ads-aside.component.html',
  styleUrls: ['./ads-aside.component.css']
})
export class AdsAsideComponent implements OnInit {
  randomPosts: Post[] = [];

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    this.postService.posts$.subscribe((posts) => {
      if (posts.length > 0) {
        // Shuffle the posts array and take the first 3 posts.
        this.randomPosts = posts.slice().sort(() => 0.5 - Math.random()).slice(0, 3);

        // Ensure each post has a thumbnailUrl (use the first image if available, otherwise a placeholder)
        this.randomPosts.forEach(post => {
          if (post.images && post.images.length > 0) {
            post.thumbnailUrl = post.thumbnailUrl || post.images[0];
          } else {
            post.thumbnailUrl = '/assets/placeholder.jpg';
          }
        });
      }
    });
  }

  openRandomPost(post: Post): void {
    if (post && post.docId) {
      this.router.navigate(['/post', post.docId]);
    }
  }
}
