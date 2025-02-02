// posts.service.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class PostsService {
  constructor(private firestore: Firestore) {}

  // Create a new post
  async createPost(postData: any): Promise<void> {
    await addDoc(collection(this.firestore, 'posts'), postData);
  }

  // Get all posts (or you can add filters)
  async getPosts(): Promise<any[]> {
    const postsSnapshot = await getDocs(collection(this.firestore, 'posts'));
    return postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Example: Get posts by category
  async getPostsByCategory(category: string): Promise<any[]> {
    const postsRef = collection(this.firestore, 'posts');
    const q = query(postsRef, where('category', '==', category));
    const postsSnapshot = await getDocs(q);
    return postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
