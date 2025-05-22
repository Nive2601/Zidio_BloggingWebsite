export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  likes: string[]; // Array of user IDs who liked the blog
}