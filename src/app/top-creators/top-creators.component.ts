import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../types/user';

@Component({
  selector: 'app-top-creators',
  imports: [],
  templateUrl: './top-creators.component.html',
  styleUrl: './top-creators.component.css',
})
export class TopCreatorsComponent implements OnInit{
  
  creators: User[] = [];

  constructor( private userService: UserService ) {}


  ngOnInit(): void {
    this.loadTopCreators();
  }

  loadTopCreators(): void {
    const observer = {
      next: (creators: User[]) => {
        this.creators = creators;
      },
      error: (error: any) => {
        console.error('Error fetching top creators:', error);
      },
      complete: () => {
        console.log('Top creators data fetch complete');
        console.log('Top creators:', this.creators);
        
      },
    };
  
    this.userService.getTopCreators().subscribe(observer);
  }
}
