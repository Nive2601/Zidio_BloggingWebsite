import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import BlogForm from '../components/blog/BlogForm';
import Alert from '../components/ui/Alert';

const CreateBlog: React.FC = () => {
  const { currentUser } = useAuth();
  const { createBlog } = useBlog();
  const navigate = useNavigate();
  const [success, setSuccess] = React.useState('');
  
  const handleSubmit = async (title: string, content: string) => {
    if (!currentUser) return;
    
    createBlog(title, content, currentUser.id, currentUser.username);
    setSuccess('Blog published successfully!');
    
    // Navigate to dashboard after showing success message
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {success && <Alert type="success" message={success} />}
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Blog</h1>
          <BlogForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;