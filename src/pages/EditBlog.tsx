import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import BlogForm from '../components/blog/BlogForm';
import Alert from '../components/ui/Alert';

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { getBlogById, updateBlog } = useBlog();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<{ title: string; content: string } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    if (id) {
      const blogData = getBlogById(id);
      
      if (!blogData) {
        setError('Blog not found');
        return;
      }
      
      if (blogData.authorId !== currentUser?.id) {
        setError('You do not have permission to edit this blog');
        return;
      }
      
      setBlog({
        title: blogData.title,
        content: blogData.content,
      });
    }
  }, [id, currentUser, getBlogById]);
  
  const handleSubmit = async (title: string, content: string) => {
    if (!id || !currentUser) return;
    
    const result = updateBlog(id, title, content);
    
    if (result) {
      setSuccess('Blog updated successfully!');
      
      // Navigate to dashboard after showing success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } else {
      setError('Failed to update blog');
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && <Alert type="success" message={success} />}
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog</h1>
          <BlogForm 
            initialTitle={blog.title} 
            initialContent={blog.content} 
            isEditing={true}
            onSubmit={handleSubmit} 
          />
        </div>
      </div>
    </div>
  );
};

export default EditBlog;