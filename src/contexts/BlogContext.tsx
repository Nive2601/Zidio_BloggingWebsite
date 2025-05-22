import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Blog } from '../types';
import { getBlogs, saveBlogs } from '../utils/storage';

interface BlogContextType {
  blogs: Blog[];
  fetchBlogs: () => void;
  getUserBlogs: (userId: string) => Blog[];
  getLikedBlogs: (userId: string) => Blog[];
  getBlogById: (id: string) => Blog | undefined;
  createBlog: (title: string, content: string, authorId: string, authorName: string) => Blog;
  updateBlog: (id: string, title: string, content: string) => Blog | undefined;
  deleteBlog: (id: string) => void;
  likeBlog: (blogId: string, userId: string) => void;
  unlikeBlog: (blogId: string, userId: string) => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const BlogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    const savedBlogs = getBlogs();
    setBlogs(savedBlogs);
  };

  const getUserBlogs = (userId: string): Blog[] => {
    return blogs.filter(blog => blog.authorId === userId);
  };

  const getLikedBlogs = (userId: string): Blog[] => {
    return blogs.filter(blog => blog.likes.includes(userId));
  };

  const getBlogById = (id: string): Blog | undefined => {
    return blogs.find(blog => blog.id === id);
  };

  const createBlog = (title: string, content: string, authorId: string, authorName: string): Blog => {
    const now = new Date().toISOString();
    const newBlog: Blog = {
      id: Date.now().toString(),
      title,
      content,
      authorId,
      author: authorName,
      createdAt: now,
      updatedAt: now,
      likes: [],
    };
    
    const updatedBlogs = [...blogs, newBlog];
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
    
    return newBlog;
  };

  const updateBlog = (id: string, title: string, content: string): Blog | undefined => {
    const blogIndex = blogs.findIndex(blog => blog.id === id);
    
    if (blogIndex === -1) return undefined;
    
    const updatedBlog = {
      ...blogs[blogIndex],
      title,
      content,
      updatedAt: new Date().toISOString(),
    };
    
    const updatedBlogs = [...blogs];
    updatedBlogs[blogIndex] = updatedBlog;
    
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
    
    return updatedBlog;
  };

  const deleteBlog = (id: string): void => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
  };

  const likeBlog = (blogId: string, userId: string): void => {
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) return;
    
    const blog = blogs[blogIndex];
    
    if (blog.likes.includes(userId)) return;
    
    const updatedBlog = {
      ...blog,
      likes: [...blog.likes, userId],
    };
    
    const updatedBlogs = [...blogs];
    updatedBlogs[blogIndex] = updatedBlog;
    
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
  };

  const unlikeBlog = (blogId: string, userId: string): void => {
    const blogIndex = blogs.findIndex(blog => blog.id === blogId);
    
    if (blogIndex === -1) return;
    
    const blog = blogs[blogIndex];
    
    const updatedBlog = {
      ...blog,
      likes: blog.likes.filter(id => id !== userId),
    };
    
    const updatedBlogs = [...blogs];
    updatedBlogs[blogIndex] = updatedBlog;
    
    setBlogs(updatedBlogs);
    saveBlogs(updatedBlogs);
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        fetchBlogs,
        getUserBlogs,
        getLikedBlogs,
        getBlogById,
        createBlog,
        updateBlog,
        deleteBlog,
        likeBlog,
        unlikeBlog,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};