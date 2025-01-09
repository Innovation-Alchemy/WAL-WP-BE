const db = require("../models");
const Blog = db.Blog;
const User= db.User;
const {createBlogSchema}= require('../utils/validations');
const Notification = db.notification;
const Tags = db.Tags;
const Report= db.Report;
/**
 * Retrieve all blogs
 */
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: Tags,  },
        { model: Report, }, 
      ],
    
    });
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
    const blog = await Blog.findByPk(req.params.id,{
      include: [
        { model: Tags,  },
        { model: Report, }, 
      ],
    
    });
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
  const { error } = createBlogSchema.validate(req.body);

  // Return validation error if any
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { user_id, event_id, title, content, description, is_approved } = req.body;

    // Check if the user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle uploaded files
    let files = [];
    if (req.files && req.files.length > 0) {
      files = req.files.map((file) =>
        process.env.NODE_ENV === "production"
          ? `https://yourdomain.com/${file.path.replace(/\\/g, "/")}`
          : `http://localhost:8080/${file.path.replace(/\\/g, "/")}`
      );
    }

    // Determine approval status
    const approvalStatus = user.role === "Admin" ? true : is_approved || false;

    // Create the blog in the database
    const blog = await Blog.create({
      user_id,
      event_id,
      title,
      content,
      files,
      description,
      is_approved: approvalStatus,
    });

    // If the user is not an admin, send a notification to admins
    if (user.role !== "Admin") {
      const adminUsers = await User.findAll({ where: { role: "Admin" } });
      const notifications = adminUsers.map((admin) => ({
        user_id: admin.id,
        notification_type: "blog-approval",
        message: `${user.name} has created a blog titled "${title}" and requests approval.`,
        blog_id: blog.id,
        is_read: false,
      }));

      await Notification.bulkCreate(notifications);
    }

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

    const { title, content,  description ,is_approved,} = req.body;

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
      ...(description && { description }),
      ...(is_approved && {is_approved}),
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
 * Retrieve blogs by user ID
 */
exports.getBlogsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params; // Updated to match the route parameter name

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find blogs by the specified user ID
    const blogs = await Blog.findAll({
      where: { user_id },
      include: [{ model: User, attributes: ["id", "name", "email"] }], // Include user info
    });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user." });
    }

    res.status(200).json({ message: "Blogs retrieved successfully", data: blogs });
  } catch (error) {
    console.error("Error retrieving blogs by user ID:", error);
    res.status(500).json({ message: "Error retrieving blogs by user ID", error: error.message });
  }
};
