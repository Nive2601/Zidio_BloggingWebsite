import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Edit, Trash2, Clock } from 'lucide-react';
import { Blog } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useBlog } from '../../contexts/BlogContext';

interface BlogCardProps {
  blog: Blog;
  showActions?: boolean;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, showActions = false }) => {
  const { currentUser } = useAuth();
  const { likeBlog, unlikeBlog, deleteBlog } = useBlog();
  
  const isAuthor = currentUser?.id === blog.authorId;
  const hasLiked = blog.likes.includes(currentUser?.id || '');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };
  
  const handleLikeToggle = () => {
    if (!currentUser) return;
    
    if (hasLiked) {
      unlikeBlog(blog.id, currentUser.id);
    } else {
      likeBlog(blog.id, currentUser.id);
    }
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(blog.id);
    }
  };
  
  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors">
              <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
            </h2>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <span>By {blog.author}</span>
              <span className="mx-2">•</span>
              <Clock size={14} className="mr-1" />
              <span>{formatDate(blog.createdAt)}</span>
            </p>
          </div>
          
          {currentUser && (
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 text-sm font-medium ${
                hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              } transition-colors`}
            >
              <Heart
                size={16}
                className={hasLiked ? 'fill-current' : ''}
              />
              <span>{blog.likes.length}</span>
            </button>
          )}
        </div>
        
        <div className="mt-4">
          <p className="text-gray-600">{truncateContent(blog.content)}</p>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <Link
            to={`/blog/${blog.id}`}
            className="text-blue-700 hover:text-blue-800 font-medium text-sm"
          >
            Read more
          </Link>
          
          {showActions && isAuthor && (
            <div className="flex gap-2">
              <Link
                to={`/edit/${blog.id}`}
                className="text-gray-600 hover:text-blue-700 transition-colors"
                title="Edit"
              >
                <Edit size={18} />
              </Link>
              <button
                onClick={handleDelete}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;