export interface Post {
  docId?: string;  // <-- Add this line
  id: string;
  title: string;
  content?: string;     // <-- changed to optional
  categories: string[];
  images?: string[];    // <-- changed to optional
  videos?: string[];
  createdAt: any;
  views: number;
  likes: number;
  thumbnailUrl?: string;
}