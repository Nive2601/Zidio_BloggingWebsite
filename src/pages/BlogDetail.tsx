import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { Heart, Edit, Trash2, ArrowLeft, Calendar, User, Clock } from 'lucide-react';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getBlogById, likeBlog, unlikeBlog, deleteBlog } = useBlog();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (id) {
      const blogData = getBlogById(id);
      
      if (!blogData) {
        setError('Blog not found');
        return;
      }
      
      setBlog(blogData);
    }
  }, [id, getBlogById]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert type="error" message={error} />
        </div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const isAuthor = currentUser?.id === blog.authorId;
  const hasLiked = blog.likes.includes(currentUser?.id || '');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const handleLikeToggle = () => {
    if (!currentUser) {
      navigate('/signin');
      return;
    }
    
    if (hasLiked) {
      unlikeBlog(blog.id, currentUser.id);
    } else {
      likeBlog(blog.id, currentUser.id);
    }
    
    // Update local state to reflect the change
    setBlog({
      ...blog,
      likes: hasLiked
        ? blog.likes.filter((id: string) => id !== currentUser.id)
        : [...blog.likes, currentUser.id],
    });
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(blog.id);
      setSuccess('Blog deleted successfully!');
      
      // Navigate to dashboard after showing success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };
  
  // Function to format content with paragraphs
  const formatContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && <Alert type="success" message={success} />}
        
        <div className="mb-8">
          <Link to="/" className="text-blue-700 hover:text-blue-800 font-medium flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{blog.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
              <div className="flex items-center mr-6 mb-2">
                <User size={16} className="mr-1" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center mb-2">
                  <Clock size={16} className="mr-1" />
                  <span>Updated on {formatDate(blog.updatedAt)}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                  hasLiked
                    ? 'bg-red-100 text-red-500'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-500'
                } transition-colors`}
              >
                <Heart
                  size={16}
                  className={hasLiked ? 'fill-current' : ''}
                />
                <span>{blog.likes.length} {blog.likes.length === 1 ? 'Like' : 'Likes'}</span>
              </button>
              
              {isAuthor && (
                <>
                  <Link
                    to={`/edit/${blog.id}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Edit size={16} />
                    <span>Edit</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="prose max-w-none mt-8 text-gray-800 leading-relaxed">
            {formatContent(blog.content)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;