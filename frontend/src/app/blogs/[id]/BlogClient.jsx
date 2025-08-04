"use client";
import { assets } from '@/Assets/assets';
import Footer from '@/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import Head from 'next/head';
import BlogItem from '@/Components/BlogItem';
import { motion } from 'framer-motion';

const BlogClient = ({ slug }) => {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Email subscription state variables
  const [email, setEmail] = useState('');
  const inputRef = useRef(null);
  // Related blogs state
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  // Generate structured data for SEO
  const generateStructuredData = (blog) => {
    if (!blog) return null;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const blogUrl = `${baseUrl}/blogs/${blog.slug}`;
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.description?.replace(/<[^>]+>/g, '').slice(0, 160),
      "image": blog.image,
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Blog",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      "datePublished": blog.date || blog.createdAt,
      "dateModified": blog.updatedAt || blog.date || blog.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": blogUrl
      },
      "url": blogUrl,
      "articleSection": blog.category,
      "keywords": [blog.category, "blog", "article", "technology", "startup", "lifestyle"],
      "wordCount": blog.description?.replace(/<[^>]+>/g, '').split(' ').length || 0,
      "commentCount": comments.length,
      "comment": comments.map(comment => ({
        "@type": "Comment",
        "author": {
          "@type": "Person",
          "name": comment.name
        },
        "text": comment.content,
        "dateCreated": comment.createdAt
      }))
    };
  };

  // Fetch blog data
  const fetchBlogData = async () => {
    if (!slug) return;
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/slug/${slug}`);
      if (response.data.success) {
        setData(response.data.blog);
      } else {
        // Blog not found or unpublished
        setData(null);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
      setData(null);
    }
  };

  // Fetch comments
  const fetchComments = async () => {
    if (!slug) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/comments`, { blogSlug: slug });
      if (res.data.success) setComments(res.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/add-comment`, {
        blog: data._id,
        name,
        content,
      });
      if (res.data.success) {
        setName('');
        setContent('');
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Social share handler with enhanced metadata
  const handleSocialShare = (platform) => {
    if (!data) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = encodeURIComponent(`${baseUrl}/blogs/${slug}`);
    const title = encodeURIComponent(data.title);
    const description = encodeURIComponent(
      data.description?.replace(/<[^>]+>/g, '').slice(0, 160) || ''
    );
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}&hashtags=blog,article`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'googleplus':
        shareUrl = `https://plus.google.com/share?url=${url}`;
        break;
      default:
        return;
    }
    window.open(
      shareUrl,
      'share-dialog',
      'width=600,height=500,resizable=yes,scrollbars=yes'
    );
  };

  // Email subscription handler
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    try {
      const response = await axios.post('/api/email', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error occurred while subscribing");
    }
  };

  const onClear = () => {
    setEmail('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlogData();
      fetchComments();
    }
    // eslint-disable-next-line
  }, [slug]);

  // Fetch related blogs after main blog is loaded
  useEffect(() => {
    if (data && data.category) {
      const fetchRelated = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/all`);
          if (response.data.success) {
            // Filter by same category, exclude current blog, limit to 3
            const related = response.data.blogs.filter(
              (b) => b.category === data.category && b.slug !== data.slug && b.isPublished !== false
            ).slice(0, 3);
            setRelatedBlogs(related);
          }
        } catch (err) {
          setRelatedBlogs([]);
        }
      };
      fetchRelated();
    }
  }, [data]);

  return (data ? (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData(data)) }}
        />
      </Head>
      <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
          <Link href='/'>
            <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto' />
          </Link>
          <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-black shadow-[-7px_7px_0px_#000000]'>
            Get started <Image src={assets.arrow} alt='' />
          </button>
        </div>
        <div className='text-center my-24'>
          <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
          <Image className='mx-auto mt-6 border border-white rounded-full' src={data.authorImg} width={60} height={60} alt='' />
          <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto'>{data.author}</p>
        </div>
      </div>
      <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
        <Image className='border-4 border-white' src={data.image} width={800} height={480} alt='' />
        <div className='blog-content' dangerouslySetInnerHTML={{__html:data.description}} />
        {/* Comments Section */}
        <div className="max-w-2xl mx-auto my-16">
          <h2 className="text-2xl font-bold mb-4">Comments ({comments.length})</h2>
          <div className="space-y-4 mb-8">
            {comments.length === 0 && <div className="text-gray-500">No comments yet.</div>}
            {comments.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded shadow">
                <div className="font-semibold">{c.name}</div>
                <div className="text-gray-600">{c.content}</div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <form onSubmit={addComment} className="bg-white p-4 rounded shadow space-y-4">
            <input
              className="w-full border px-3 py-2 rounded"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <textarea
              className="w-full border px-3 py-2 rounded"
              placeholder="Your comment"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        </div>
        {/* Email Subscription Section */}
        <div className="max-w-2xl mx-auto my-16">
          <h3 className="text-xl font-semibold mb-4">Subscribe to our newsletter</h3>
          {/* Email subscription form */}
          <form 
            onSubmit={onSubmitHandler} 
            className='flex justify-between max-w-xl mx-auto border border-gray-200 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 focus-within:shadow-lg focus-within:border-[#5044E5]/50'
          >
            <input 
              ref={inputRef}
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              placeholder='Enter your email' 
              required 
              className='w-full px-5 py-3 outline-none placeholder-gray-400 text-gray-700'
            />
            <button 
              type="submit" 
              className='bg-gradient-to-r from-[#5044E5] to-[#5044E5] text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity duration-200 flex items-center'
            >
              Subscribe
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </form>
          {/* Clear button */}
          {email && (
            <div className='mt-4'>
              <button 
                onClick={onClear} 
                className='inline-flex items-center text-sm text-gray-500 hover:text-[#5044E5] transition-colors duration-200'
              >
                Clear email
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
        {/* Share Section */}
        <div className='my-24'>
          <p className='text-black font-semibold my-4'>Share this article on social media</p>
          <div className='flex gap-2'>
            {/* Facebook Share */}
            <button
              onClick={() => handleSocialShare('facebook')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on Facebook"
            >
              <Image src={assets.facebook_icon} width={50} alt='Share on Facebook' />
            </button>
            {/* Twitter Share */}
            <button
              onClick={() => handleSocialShare('twitter')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on Twitter"
            >
              <Image src={assets.twitter_icon} width={50} alt='Share on Twitter' />
            </button>
            {/* LinkedIn Share */}
            <button
              onClick={() => handleSocialShare('linkedin')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on LinkedIn"
            >
              <Image src={assets.linkedin_icon} width={35} alt='Share on LinkedIn' />
            </button>
            {/* Google Plus Share */}
            <button
              onClick={() => handleSocialShare('googleplus')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              title="Share on Google Plus"
            >
              <Image src={assets.googleplus_icon} width={50} alt='Share on Google Plus' />
            </button>
          </div>
        </div>
        {/* You may also like section */}
{relatedBlogs.length > 0 && (
  <section className="my-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
    <h2 className="text-3xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none">
      You may also like
    </h2>

    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {relatedBlogs.map((blog, index) => (
        <motion.div
          key={blog.slug}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          className="cursor-pointer rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow duration-300 bg-white"
          onClick={() => window.location.href = `/blogs/${blog.slug}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') window.location.href = `/blogs/${blog.slug}`;
          }}
          role="link"
          aria-label={`Read blog titled ${blog.title}`}
        >
          {/* Assuming BlogItem already styles the card */}
          <BlogItem
            title={blog.title}
            description={blog.description}
            category={blog.category}
            image={blog.image}
            slug={blog.slug}
          />
        </motion.div>
      ))}
    </motion.div>
  </section>
)}

      </div>
      <Footer />
    </>
  ) : data === null ? (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-800 mb-4'>Blog Not Found</h1>
        <p className='text-gray-600 mb-8'>This blog post does not exist or has been unpublished.</p>
        <Link href='/' className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
          Back to Home
        </Link>
      </div>
    </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
        <p className='text-gray-600'>Loading...</p>
      </div>
    </div>
  ));
};

export default BlogClient;