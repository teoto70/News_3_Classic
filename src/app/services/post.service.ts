// post.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Post {
  id: string;
  title: string;
  content: string;
  categories: string[];
  images: string[];
  videos: string[];
  createdAt: any; // or Timestamp
  views: number;
  likes: number;
  thumbnailUrl?: string; 
}

@Injectable({ providedIn: 'root' })
export class PostService {
  // 1) A private BehaviorSubject that holds the latest list of posts
  private postsSubject = new BehaviorSubject<Post[]>([]);

  // 2) A public observable so components can subscribe to the current posts
  public posts$ = this.postsSubject.asObservable();

  constructor(private firestore: Firestore) {
    // Optionally, you can call loadPosts() here if you want to load automatically.
    // this.loadPosts();
  }

  /**
   * Fetches all posts from Firestore (one-time) and updates the postsSubject.
   * Components subscribed to `posts$` will get the new data automatically.
   */
  loadPosts(): void {
    this.getAllPosts().subscribe({
      next: (fetchedPosts) => {
        this.postsSubject.next(fetchedPosts);
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      }
    });
  }

  /**
   * Returns an Observable of all posts from Firestore.
   * If you only want to read the data via posts$, keep this private.
   */
  public getAllPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    return collectionData(postsRef, { idField: 'docId' }) as Observable<Post[]>;
  }
}
