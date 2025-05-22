import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';
import BlogList from '../components/blog/BlogList';
import Button from '../components/ui/Button';
import { BookOpen, Pen, Users } from 'lucide-react';

const Home: React.FC = () => {
  const { blogs, fetchBlogs } = useBlog();
  const { isAuthenticated } = useAuth();
  const [visibleBlogs, setVisibleBlogs] = useState<number>(6);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Sort blogs by creation date (newest first)
  const sortedBlogs = [...blogs].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const displayedBlogs = sortedBlogs.slice(0, visibleBlogs);
  
  const loadMore = () => {
    setVisibleBlogs(prev => prev + 6);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-900 to-indigo-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Share Your Voice With The World
          </h1>
          <p className="text-xl max-w-2xl mb-8">
            Create beautiful blogs, share your thoughts, and connect with readers from around the globe.
          </p>
          {isAuthenticated ? (
            <Link to="/create">
              <Button size="lg" className="animate-pulse">
                Start Writing
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button size="lg" className="animate-pulse">
                Join BlogWave
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BlogWave?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, share, and grow your blog.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="text-blue-700 mb-4">
                <Pen size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Easy to Use</h3>
              <p className="text-gray-600">
                Simple and intuitive interface lets you focus on what matters most - your content.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="text-blue-700 mb-4">
                <BookOpen size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Beautiful Design</h3>
              <p className="text-gray-600">
                Your content deserves to shine with our clean, modern, and responsive design.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md transition-transform duration-300 hover:-translate-y-2">
              <div className="text-blue-700 mb-4">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">Engage Readers</h3>
              <p className="text-gray-600">
                Connect with your audience through likes and build a community around your writing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Blogs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover fresh perspectives and inspiring stories from our community.
            </p>
          </div>
          
          <BlogList blogs={displayedBlogs} />
          
          {sortedBlogs.length > visibleBlogs && (
            <div className="text-center mt-12">
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your blogging journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are sharing their stories on BlogWave.
          </p>
          {isAuthenticated ? (
            <Link to="/create">
              <Button variant="secondary" size="lg">
                Create Your First Blog
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button variant="secondary" size="lg">
                Sign Up Now
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;