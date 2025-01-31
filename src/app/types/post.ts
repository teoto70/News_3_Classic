export interface Post {
    uid: string;
    username: string;
    pfp: string;
    likesCount: number;
    comments: [];
    img: string;
    caption: string;
    createdAt: number;
    theme: string;
}