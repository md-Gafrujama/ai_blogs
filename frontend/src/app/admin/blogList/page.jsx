"use client";
import React, { useEffect, useState } from 'react';
import BlogTableItem from '@/Components/AdminComponents/BlogTableItem';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const { axios } = useAppContext();

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem('token'); // or from context

             const { data } = await axios.get(`${baseURL}/api/admin/blogs?company=QuoreB2B`, {
         headers: {
           Authorization: `Bearer ${token}`,
         },
       });
      console.log('API response:', data);
      if (data.success) {
        setBlogs(data.blogs);
        console.log('Blogs set:', data.blogs);
      } else {
        toast.error(data.message || 'Failed to fetch blogs');
      }
    } catch (error) {
      toast.error(error.message);
      console.error('Fetch blogs error:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'>
      <h1>All blogs</h1>
      <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white'>
        <table className='w-full text-sm text-gray-500'>
          <thead className='text-xs text-gray-600 text-left uppercase'>
            <tr>
              <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
              <th scope='col' className='px-2 py-4'> Blog Title </th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
              <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
              <th scope='col' className='px-2 py-4'> Actions </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(blogs) && blogs.length > 0 ? (
              blogs.map((blog, index) => {
                try {
                  return <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchBlogs} index={index + 1} />;
                } catch (err) {
                  console.error('BlogTableItem render error:', err, blog);
                  return <tr key={blog._id}><td colSpan={5}>Error rendering blog: {blog.title}</td></tr>;
                }
              })
            ) : (
              <tr><td colSpan={5} className="text-center py-8">No blogs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListBlog;
