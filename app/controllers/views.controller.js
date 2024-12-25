// controllers/Views.controller.js

const db = require("../models");
const Views = db.views;
const Blog = db.Blog;
const User = db.User;


// Get all view records
exports.getAllViews = async (req, res) => {
  try {
    const views = await Views.findAll({
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
          ],
        },
        { model: Blog, attributes: ['id', 'title', 'user_id'] }, // Include Blog owner ID
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(views);
  } catch (error) {
    console.error("Error retrieving view records:", error);
    res.status(500).json({ message: "Error retrieving view records", error: error.message });
  }
};

// Add a new view
exports.addView = async (req, res) => {
  const { user_id, blog_id } = req.body;

  // Validate required fields
  if (!user_id || !blog_id) {
    return res.status(400).json({ message: "User ID and Blog ID are required." });
  }

  try {
    // Check if the user exists
    const viewer = await User.findByPk(user_id, {
      attributes: ['id',  'name'],
    });
    if (!viewer) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the blog exists
    const blog = await Blog.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Prevent users from viewing their own blogs (optional)
    if (blog.user_id === user_id) {
      return res.status(400).json({ message: "Users cannot view their own Blogs." });
    }

    // Create the view record
    const newView = await Views.create({ user_id, blog_id });

    res.status(201).json(newView);
  } catch (error) {
    console.error("Error adding view:", error);
    res.status(500).json({ message: "Error adding view", error: error.message });
  }
};

// Get a view record by ID
exports.getViewById = async (req, res) => {
  const { id } = req.params;
  try {
    const view = await Views.findOne({
      where: { id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
          ],
        },
        { model: Blog, attributes: ['id', 'title'] },
      ],
    });
    if (!view) {
      return res.status(404).json({ message: "View record not found." });
    }
    res.status(200).json(view);
  } catch (error) {
    console.error("Error retrieving view record:", error);
    res.status(500).json({ message: "Error retrieving view record", error: error.message });
  }
};

// Get views by Blog ID
exports.getViewsByBlogId = async (req, res) => {
  const { blog_id } = req.params;
  try {
    const views = await Views.findAll({
      where: { blog_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
          ],
        },
        { model: Blog, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (views.length === 0) {
      return res.status(404).json({ message: "No views found for this Blog." });
    }
    res.status(200).json(views);
  } catch (error) {
    console.error("Error retrieving views for the Blog:", error);
    res.status(500).json({ message: "Error retrieving views for the Blog.", error: error.message });
  }
};

// Get views by User ID
exports.getViewsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const views = await Views.findAll({
      where: { user_id },
      include: [
        {
          model: User,
          attributes: [
            'id',
            'name',
          ],
        },
        { model: Blog, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (views.length === 0) {
      return res.status(404).json({ message: "No views found for this user." });
    }
    res.status(200).json(views);
  } catch (error) {
    console.error("Error retrieving views for the user:", error);
    res.status(500).json({ message: "Error retrieving views for the user.", error: error.message });
  }
};

// Delete a view record by ID
exports.deleteView = async (req, res) => {
  const { id } = req.params;
  try {
    const view = await Views.findOne({ where: { id } });
    if (!view) {
      return res.status(404).json({ message: "View record not found." });
    }

    await view.destroy();
    res.status(200).json({ message: "View record deleted successfully." });
  } catch (error) {
    console.error("Error deleting view record:", error);
    res.status(500).json({ message: "Error deleting view record", error: error.message });
  }
};

// Count all views for a specific Blog
exports.getViewsCountByBlogId = async (req, res) => {
  const { blog_id } = req.params;

  // Validate the blog_id
  if (!blog_id) {
    return res.status(400).json({ message: "Blog ID is required." });
  }

  try {
    // Ensure Blog exists
    const blog = await Blog.findByPk(blog_id); 
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Count the number of views for the Blog
    const viewCount = await Views.count({
      where: { blog_id },
    });

    res.status(200).json({ blog_id, viewCount });
  } catch (error) {
    console.error("Error counting views:", error);
    res.status(500).json({ message: "Error counting views", error: error.message });
  }
};
