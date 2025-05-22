import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import BlogList from '../components/blog/BlogList';
import Button from '../components/ui/Button';
import { PenSquare, Heart, User, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { getUserBlogs, getLikedBlogs, fetchBlogs } = useBlog();
  const [activeTab, setActiveTab] = useState<'myBlogs' | 'likedBlogs'>('myBlogs');
  
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);
  
  if (!currentUser) {
    return null;
  }
  
  const userBlogs = getUserBlogs(currentUser.id);
  const likedBlogs = getLikedBlogs(currentUser.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-8 w-8 text-blue-700" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentUser.username}</h1>
                <p className="text-gray-600">{currentUser.email}</p>
              </div>
            </div>
            <Link to="/create">
              <Button className="flex items-center">
                <PenSquare className="mr-2 h-4 w-4" />
                Write New Blog
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('myBlogs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'myBlogs'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  My Blogs ({userBlogs.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('likedBlogs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'likedBlogs'
                    ? 'border-blue-700 text-blue-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <Heart className="mr-2 h-4 w-4" />
                  Liked Blogs ({likedBlogs.length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'myBlogs' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Blogs</h2>
              </div>
              <BlogList 
                blogs={userBlogs} 
                showActions={true} 
                emptyMessage="You haven't created any blogs yet. Click 'Write New Blog' to get started!"
              />
            </>
          )}

          {activeTab === 'likedBlogs' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Blogs You've Liked</h2>
              </div>
              <BlogList 
                blogs={likedBlogs} 
                emptyMessage="You haven't liked any blogs yet. Explore and find content you enjoy!"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;