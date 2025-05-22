import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import AuthGuard from './components/auth/AuthGuard';
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogDetail from './pages/BlogDetail';

// Add global styles
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BlogProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/blog/:id" element={<BlogDetail />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/create" 
                  element={
                    <AuthGuard>
                      <CreateBlog />
                    </AuthGuard>
                  } 
                />
                <Route 
                  path="/edit/:id" 
                  element={
                    <AuthGuard>
                      <EditBlog />
                    </AuthGuard>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BlogProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;