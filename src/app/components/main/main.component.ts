import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  latestPosts = [
    { title: 'Lorem ipsum dolor sit amet', category: 'Travel', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Consectetur adipiscing elit', category: 'Travel', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Sed do eiusmod tempor incididunt', category: 'News', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Ut labore et dolore magna aliqua', category: 'News', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Quis nostrud exercitation ullamco', category: 'Life', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Duis aute irure dolor in reprehenderit', category: 'Life', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Excepteur sint occaecat cupidatat', category: 'Travel', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' },
    { title: 'Sunt in culpa qui officia deserunt', category: 'News', date: '01/02/2025', thumbnail: 'https://via.placeholder.com/400x250' }
  ];

  sections = [
    {
      tag: 'Travel',
      posts: [
        { title: 'Lorem ipsum dolor sit amet', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Consectetur adipiscing elit', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Sed do eiusmod tempor incididunt', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Ut labore et dolore magna aliqua', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Quis nostrud exercitation ullamco', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Duis aute irure dolor in reprehenderit', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Excepteur sint occaecat cupidatat', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Sunt in culpa qui officia deserunt', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' }
      ]
    },
    {
      tag: 'News',
      posts: [
        { title: 'Breaking news: Lorem ipsum dolor sit', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'World event: Consectetur adipiscing', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Exclusive: Sed do eiusmod tempor', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Politics: Ut labore et dolore magna', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Finance update: Quis nostrud exercitation', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Tech trends: Duis aute irure dolor', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Health: Excepteur sint occaecat', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Sports: Sunt in culpa qui officia', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' }
      ]
    },
    {
      tag: 'Life',
      posts: [
        { title: 'Lifestyle: Lorem ipsum dolor sit amet', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Wellness: Consectetur adipiscing elit', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Mindfulness: Sed do eiusmod tempor', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Fitness: Ut labore et dolore magna', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Self-care: Quis nostrud exercitation', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Relationships: Duis aute irure dolor', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Mental Health: Excepteur sint occaecat', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' },
        { title: 'Travel & Life: Sunt in culpa qui officia', thumbnail: 'https://www.pexels.com/search/free%20no%20copyright/' }
      ]
    }
  ];
}
