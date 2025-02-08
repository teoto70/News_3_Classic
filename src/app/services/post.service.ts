// post.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Post {
  docId?: string;  // Firestore document ID
  id: string;
  title: string;
  content: string;
  categories: string[];
  images: string[];
  videos: string[];
  createdAt: any; // Firestore Timestamp or other date format
  views: number;
  likes: number;
  thumbnailUrl?: string; 
}

@Injectable({ providedIn: 'root' })
export class PostService {
  // A private BehaviorSubject that holds the latest list of posts
  private postsSubject = new BehaviorSubject<Post[]>([]);

  // A public observable so components can subscribe to the current posts
  public posts$ = this.postsSubject.asObservable();

  constructor(private firestore: Firestore) {
    // Optionally, you can call loadPosts() here to load automatically.
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
   */
  public getAllPosts(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    return collectionData(postsRef, { idField: 'docId' }) as Observable<Post[]>;
  }

  /**
   * Returns an Observable for a single post identified by its document ID.
   *
   * @param docId The Firestore document ID of the post.
   * @returns An Observable that emits the post data.
   */
  public getPostById(docId: string): Observable<Post> {
    const postDocRef = doc(this.firestore, 'posts', docId);
    return docData(postDocRef, { idField: 'docId' }) as Observable<Post>;
  }
}
