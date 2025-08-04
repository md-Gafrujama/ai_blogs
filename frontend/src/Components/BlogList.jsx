"use client";
import React, { useEffect, useState, useContext, createContext } from 'react'
import { motion } from "motion/react"
import axios from 'axios';
import BlogItem from '@/Components/BlogItem';

// Create context
const AppContext = createContext();

// Blog categories
const blogCategories = ["All", "Technology", "Startup", "Lifestyle"];

// Enhanced BlogCard component with React design
const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id, slug } = blog;

  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
      .replace(/\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }

  const handleClick = () => {
    window.location.href = `/blogs/${slug || _id}`;
  };

  // Calculate reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 200;
    const words = text.replace(/<[^>]+>/g, '').split(' ').length;
    return Math.ceil(words / wordsPerMinute);
  };

  const readingTime = calculateReadingTime(description);

  return (
    <motion.article
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, rotate: 1 }}
      transition={{ duration: 0.1, ease: "easeOut" }}
      className="group relative w-full bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-gray-100 hover:border-transparent transition-all duration-700 cursor-pointer"
      style={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {/* Premium gradient border */}
      <div className="absolute inset-0 rounded-3xl p-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="w-full h-full bg-white rounded-3xl"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 bg-white rounded-3xl">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl transform -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-pink-500/10 to-blue-500/10 rounded-full blur-xl transform translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-700"></div>
        
        {/* Image Container with Modern Effects */}
        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-52 object-cover transform group-hover:scale-105 transition-all duration-700 group-hover:brightness-105"
              loading="lazy"
            />
            
            {/* Premium overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          {/* Floating Category Badge */}
          <div className="absolute top-4 left-4 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
              <span className="relative inline-flex items-center px-4 py-2 bg-white/95 backdrop-blur-md rounded-full text-xs font-bold text-gray-800 shadow-lg border border-white/50 transition-all duration-300 group-hover:text-blue-600 group-hover:shadow-xl">
                {category}
              </span>
            </div>
          </div>

          {/* Premium read indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
            <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md rounded-full px-3 py-1.5 text-white text-xs border border-white/20 shadow-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">{readingTime} min read</span>
            </div>
          </div>

          {/* Corner accent */}
          <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-sm opacity-50"></div>
          </div>
        </div>

        {/* Enhanced Content Section */}
        <div className="p-6 space-y-4 relative">
          {/* Title with premium typography */}
          <h3 className="text-lg font-bold leading-tight text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300 line-clamp-2">
            {title}
          </h3>

          {/* Description with better spacing */}
          <div 
            className="text-gray-600 group-hover:text-gray-700 text-sm leading-relaxed line-clamp-3 transition-colors duration-300"
            dangerouslySetInnerHTML={{ "__html": description.slice(0, 120) + "..." }}
          />

          {/* Professional Footer */}
          <div className="flex items-center justify-between pt-4 mt-4">
            {/* Author/Read section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-300">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                Read Article
              </span>
            </div>
            
            {/* Premium arrow */}
            <div className="relative">
              <div className="flex items-center justify-center w-8 h-8 text-gray-400 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 rounded-full transition-all duration-300 group-hover:shadow-lg">
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-xl"></div>
      
      {/* Subtle animated dots */}
      <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-1000 transform scale-0 group-hover:scale-100 group-hover:animate-ping"></div>
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-1200 delay-300 transform scale-0 group-hover:scale-100 group-hover:animate-pulse"></div>
    </motion.article>
  );
};

// Main BlogList component
const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/all`);
      setBlogs(response.data.blogs);
      setSearchResults(response.data.blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Enhanced search functionality
  const handleSearch = async (searchTerm) => {
    setInput(searchTerm);
    if (!searchTerm.trim()) {
      setSearchResults(blogs);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Client-side search
    const filtered = blogs.filter((blog) => 
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filtered);
    setIsSearching(false);
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, blogs]);

  // Get filtered blogs based on category and search
  const getFilteredBlogs = () => {
    let filtered = searchResults;
    
    if (menu !== "All") {
      filtered = filtered.filter(item => item.category === menu);
    }
    
    return filtered;
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#5044E5] to-purple-600 text-white py-16 px-6">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Discover Amazing Content
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl opacity-90 mb-8"
          >
            Explore our collection of insightful articles and stories
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {/* Enhanced Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-12 border border-gray-100"
        >
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search articles, categories..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5044E5] focus:border-transparent text-gray-700 placeholder-gray-400 transition-all duration-300"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-[#5044E5] border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
          
          {/* Search Stats */}
          {input && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-4 text-sm text-gray-600"
            >
              Found {getFilteredBlogs().length} result{getFilteredBlogs().length !== 1 ? 's' : ''} for {input}
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Category Navigation */}
        <div className='flex justify-center mb-12'>
          <div className='flex flex-wrap justify-center gap-2 sm:gap-4 bg-white rounded-2xl p-2 shadow-lg border border-gray-100'>
            {blogCategories.map((item, index) => (
              <motion.div
                key={item}
                className='relative'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button 
                  onClick={() => setMenu(item)}
                  className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    menu === item 
                      ? 'text-[#5044E5] shadow-lg' 
                      : 'text-gray-600 hover:text-[#5044E5] hover:bg-gray-50'
                  }`}
                >
                  {item}
                  {menu === item && (
                    <motion.div 
                      layoutId='activeCategory' 
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className='absolute inset-0 bg-gradient-to-r from-[#5044E5] to-purple-500 rounded-xl -z-10'
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin h-12 w-12 border-4 border-[#5044E5] border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading amazing content...</p>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && (
          <motion.div 
            layout
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'
          >
            {getFilteredBlogs().length > 0 ? (
              getFilteredBlogs().map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <BlogCard blog={item} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">
                    {input ? `No results for "${input}". Try different keywords.` : 'No articles available in this category.'}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Results Summary */}
        {!isLoading && getFilteredBlogs().length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 border-t border-gray-200"
          >
            <p className="text-gray-600">
              Showing {getFilteredBlogs().length} of {blogs.length} articles
              {menu !== "All" && ` in ${menu}`}
              {input && ` matching "${input}"`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default BlogList;