import { User, Blog } from '../types';

// User related storage functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

// Blog related storage functions
export const getBlogs = (): Blog[] => {
  const blogs = localStorage.getItem('blogs');
  return blogs ? JSON.parse(blogs) : [];
};

export const saveBlogs = (blogs: Blog[]): void => {
  localStorage.setItem('blogs', JSON.stringify(blogs));
};

export const getUserBlogs = (userId: string): Blog[] => {
  return getBlogs().filter(blog => blog.authorId === userId);
};

export const getLikedBlogs = (userId: string): Blog[] => {
  return getBlogs().filter(blog => blog.likes.includes(userId));
};