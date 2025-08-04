import fs from 'fs';
import imagekit from '../config/imagekit.js';
import Blog from '../models/BlogModel.js';
import Comment from '../models/CommentModel.js';
import main from '../config/gemini.js';

// Helper function to slugify the blog title
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^a-z0-9\-]/g, '')    // Remove all non-alphanumeric chars except -
    .replace(/\-+/g, '-')           // Replace multiple - with single -
    .replace(/^-+/, '')              // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
}

export const addBlog = async (req, res) => {
  try {
    // If using FormData, fields are in req.body, file in req.file
    const { title, description, category, author, authorImg, isPublished, company } = req.body;
    const imageFile = req.file;

    if (!title || !description || !category || !author || !authorImg || !imageFile || !company) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);

    // Upload Image to ImageKit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blogs"
    });

    // Clean up temp file
    fs.unlinkSync(imageFile.path);

    // optimization through imagekit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: 'auto' },
        { format: 'webp' },
        { width: '1280' }
      ]
    });

    const image = optimizedImageUrl;
    const slug = slugify(title);

    await Blog.create({ title, description, category, author, authorImg, image, slug, company, isPublished: isPublished === 'true' });

    res.json({ success: true, message: "Blog added successfully" });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true }); // Only return published blogs for public API
    res.json({ success: true, blogs });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.body;
    await Blog.findByIdAndDelete(id);
    // Delete all comments associated with the blog
    await Comment.deleteMany({ blog: id });
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.body;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: 'Blog status updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({ success: true, message: 'Comment added for review' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blogSlug } = req.body;
    const blog = await Blog.findOne({ slug: blogSlug });
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    const comments = await Comment.find({ blog: blog._id, isApproved: true }).sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Enhanced prompt to generate properly formatted blog content
    const enhancedPrompt = `Generate a comprehensive blog post about "${prompt}". 
    
    Please format the response as a well-structured blog with the following HTML structure:
    
    - Start with an engaging introduction paragraph
    - Include 3-4 main sections with clear headings (use <h2> tags)
    - Each section should have 2-3 paragraphs of content
    - Use <p> tags for paragraphs
    - Include bullet points where appropriate (use <ul> and <li> tags)
    - End with a conclusion paragraph
    - Make the content engaging, informative, and easy to read
    - Use proper HTML formatting with <h2>, <p>, <ul>, <li> tags
    - Keep paragraphs concise (2-4 sentences each)
    - Include practical tips or actionable advice where relevant
    
    The content should be professional yet conversational in tone.`;
    
    const rawContent = await main(enhancedPrompt);
    
    // Format the content into proper HTML structure
    let formattedContent = rawContent;
    
    // Clean up the content and ensure proper HTML structure
    formattedContent = formattedContent
      .replace(/```html\s*/g, '') // Remove ```html markers
      .replace(/```\s*/g, '') // Remove ``` markers
      .replace(/^\s*<html>\s*/i, '') // Remove <html> tags
      .replace(/<\/html>\s*$/i, '') // Remove </html> tags
      .replace(/^\s*<body>\s*/i, '') // Remove <body> tags
      .replace(/<\/body>\s*$/i, '') // Remove </body> tags
      .replace(/^\s*<head>.*?<\/head>\s*/is, '') // Remove <head> section
      .replace(/^\s*<!DOCTYPE.*?>\s*/i, '') // Remove DOCTYPE
      .trim();
    
    // Ensure proper HTML structure if the AI didn't format it correctly
    if (!formattedContent.includes('<h2>') && !formattedContent.includes('<p>')) {
      // Split content into paragraphs and format manually
      const paragraphs = rawContent.split('\n\n').filter(p => p.trim());
      
      formattedContent = '';
      
      // First paragraph as introduction
      if (paragraphs.length > 0) {
        formattedContent += `<p>${paragraphs[0].trim()}</p>`;
      }
      
      // Add section headings and content
      for (let i = 1; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        if (paragraph.length > 0) {
          // If paragraph starts with a number or looks like a heading, make it h2
          if (/^\d+\.\s|^[A-Z][^.!?]*$/.test(paragraph) && paragraph.length < 100) {
            formattedContent += `<h2>${paragraph}</h2>`;
          } else {
            formattedContent += `<p>${paragraph}</p>`;
          }
        }
      }
    }
    
    // Final cleanup - remove extra whitespace and normalize
    formattedContent = formattedContent
      .replace(/\n\s*\n/g, '') // Remove extra line breaks
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/>\s+</g, '><') // Remove whitespace between tags
      .trim();
    
    // Ensure we have valid HTML structure
    if (!formattedContent.startsWith('<')) {
      formattedContent = `<p>${formattedContent}</p>`;
    }
    
    res.json({ success: true, content: formattedContent });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, isPublished: true }); // Only return published blogs
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};