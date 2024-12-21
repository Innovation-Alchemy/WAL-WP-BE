const db = require("../models");
const Blog = db.Blog;

/**
 * Retrieve all blogs
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json({ message: "Blogs retrieved successfully", data: blogs });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).json({ message: "Error retrieving blogs", error: error.message });
  }
};

/**
 * Retrieve a single blog by ID
 */
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog retrieved successfully", data: blog });
  } catch (error) {
    console.error("Error retrieving blog:", error);
    res.status(500).json({ message: "Error retrieving blog", error: error.message });
  }
};

/**
 * Create a new blog
 */
exports.createBlog = async (req, res) => {
  try {
    const { user_id, event_id, title, content, tags, description } = req.body;

    // Handle uploaded files
    let files = [];
    if (req.files && req.files.length > 0) {
      files = req.files.map((file) =>
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`
      );
    }

    // Create the blog in the database
    const blog = await Blog.create({
      user_id,
      event_id,
      title,
      content,
      tags: tags ? JSON.parse(tags) : [], // Parse tags if sent as a JSON string
      files, // Save file URLs
      description,
    });

    res.status(201).json({ message: "Blog created successfully", data: blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Error creating blog", error: error.message });
  }
};

/**
 * Update a blog by ID
 */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog post by ID
    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const { title, content, tags, description } = req.body;

    // Parse existing files if necessary
    let existingFiles = [];
    if (blog.files && typeof blog.files === "string") {
      try {
        existingFiles = JSON.parse(blog.files);
      } catch (error) {
        console.error("Error parsing existing files:", error);
      }
    } else if (Array.isArray(blog.files)) {
      existingFiles = blog.files;
    }

    // Handle uploaded files
    let newFiles = [];
    if (req.files && req.files.length > 0) {
      newFiles = req.files.map((file) =>
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`
      );
    }

    // Merge new files with existing files
    const updatedFiles = [...existingFiles, ...newFiles];

    // Update only the provided fields
    await blog.update({
      ...(title && { title }),
      ...(content && { content }),
      ...(tags && { tags: JSON.parse(tags) }), // Replace tags array if provided
      ...(description && { description }),
      files: updatedFiles, // Update the files array
    });

    res.status(200).json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Error updating blog", error: error.message });
  }
};



/**
 * Delete a blog by ID
 */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    await blog.destroy();
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Error deleting blog", error: error.message });
  }
};

/**
 * Increment likes on a blog post
 */
exports.likeBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.likes += 1; // Increment likes
    await blog.save();

    res.status(200).json({ message: "Blog liked successfully", data: blog });
  } catch (error) {
    console.error("Error liking blog:", error);
    res.status(500).json({ message: "Error liking blog", error: error.message });
  }
};

/**
 * Add a comment to a blog post
 */
exports.addCommentToBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, comment } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Add the new comment (array of objects)
    const newComment = { user_id, comment, createdAt: new Date() };
    blog.comments = [...(blog.comments || []), newComment];

    await blog.save();

    res.status(201).json({ message: "Comment added successfully", data: blog });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};

/**
 * Increment views on a blog post
 */
exports.addViewToBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.views += 1; // Increment views
    await blog.save();

    res.status(200).json({ message: "View added successfully", data: blog });
  } catch (error) {
    console.error("Error adding view:", error);
    res.status(500).json({ message: "Error adding view", error: error.message });
  }
};
