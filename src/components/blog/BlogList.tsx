import React from 'react';
import { Blog } from '../../types';
import BlogCard from './BlogCard';

interface BlogListProps {
  blogs: Blog[];
  showActions?: boolean;
  emptyMessage?: string;
}

const BlogList: React.FC<BlogListProps> = ({ 
  blogs, 
  showActions = false,
  emptyMessage = "No blogs found"
}) => {
  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard 
          key={blog.id} 
          blog={blog} 
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default BlogList;