import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsSubject = new BehaviorSubject<any[]>([]);
  posts$ = this.postsSubject.asObservable();

  setPosts(posts: any[]): void {
    this.postsSubject.next(posts);
  }

  getPosts(): any[] {
    return this.postsSubject.getValue();
  }
}