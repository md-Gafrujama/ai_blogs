"use client";
import React, { useRef, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Image from "next/image";
import { assets } from '@/Assets/assets';
const Header = () => {
  const [email, setEmail] = useState("");
  const inputRef = useRef();
  const [isHovering, setIsHovering] = useState(false);

  // Assets would typically be imported differently in React
  // const assets = {
  //   logo: '/images/logo.png', // Replace with your actual logo path
  //   star_icon: '/images/star.png' // Replace with your actual star icon path
  // };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    
    try {
      const response = await axios.post('/api/email', formData);
      if (response.data.success) {
        toast.success(response.data.msg);
        setEmail("");
        inputRef.current.value = '';
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error occurred while subscribing");
    }
  };

  const onClear = () => {
    setEmail('');
    inputRef.current.value = '';
  };

  return (
    <div className='relative overflow-hidden'>
      {/* Background elements */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#5044E5]/5 to-transparent opacity-30'></div>
        <div className='absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#5044E5]/5 to-transparent opacity-20'></div>
      </div>
      <div className='py-10 px-5 md:px-12 lg:px-28'>
        <div className='flex justify-between items-center'>
          {/* <Image src={assets.logo} width={180} alt='image' className='w-[130px] sm:w-auto'/> */}
        </div>

        <div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 relative pt-32 pb-24'>
          {/* Header with logo and button */}
          <div className='flex justify-between items-center mb-12'>
            <Image
              src={assets.logo}
              width={180}
              alt='logo'
              className='w-[130px] sm:w-auto'
            />
            {/* <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>
              Get started
            </button> */}
          </div>

          <div className='text-center'>
            {/* New feature badge with animation */}
            <div 
              className='inline-flex items-center justify-center gap-2 px-4 py-1 mb-6 border border-[#5044E5]/40 bg-[#5044E5]/10 rounded-full text-sm text-[#5044E5] shadow-sm hover:shadow-[#5044E5]/20 transition-all duration-300 cursor-default animate-pulse'
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <p>New: Subscribe to our newsletter</p>
              <img 
                src={assets.star_icon} 
                className={`w-3 h-3 transition-transform duration-300 ${isHovering ? 'rotate-180 scale-110' : ''}`} 
                alt="Star icon" 
              />
            </div>

            {/* Main heading with gradient text */}
            <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-gray-800 mb-6'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-[#5044E5] to-[#5044E5]-dark'>Latest Blogs</span>
              <br />
              Stay Updated
            </h1>

            {/* Subheading */}
            <p className='my-6 max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed'>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
              Lorem Ipsum has been the industry standard dummy text ever.
            </p>

            {/* Email subscription form with focus effects */}
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
                className='bg-gradient-to-r from-[#5044E5] to-[#5044E5]-dark text-white px-6 py-3 font-medium hover:opacity-90 transition-opacity duration-200 flex items-center'
              >
                Subscribe
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </form>

            {/* Clear button with smooth appearance */}
            {email && (
              <div className='mt-4 animate-fade-in'>
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

          {/* Decorative elements */}
          <div className='absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#5044E5]/10 blur-xl'></div>
          <div className='absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#5044E5]/10 blur-xl'></div>
        </div>
      </div>
    </div>
  );
};

export default Header;
