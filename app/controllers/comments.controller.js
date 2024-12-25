// controllers/comment.controller.js

const db = require("../models");
const Comment = db.comments;
const Blog = db.Blog;
const User = db.User;



// Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, attributes: ['id','name'] },
        { model: Blog, attributes: ['id', 'title', 'user_id'] }, // Include Blog owner ID
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments", error: error.message });
  }
};

// Add a new comment
exports.addComment = async (req, res) => {
  const { user_id, blog_id, content } = req.body;

  // Check for required fields
  if (!user_id || !blog_id || !content) {
    return res.status(400).json({ message: "User ID, Blog ID, and content are required." });
  }

  try {
    // Check if the user exists
    const commenter = await User.findByPk(user_id);
    if (!commenter) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the blog exists
    const blog = await Blog.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Create the comment record
    const newComment = await Comment.create({
      user_id,
      blog_id,
      content,
    });

    // Optionally, you can fetch additional information to include in the response
    res.status(201).json({ message: "Comment added successfully.", newComment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Error adding comment", error: error.message });
  }
};


// Get a comment by ID
exports.getCommentById = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Blog, attributes: ['id', 'title'] },
      ],
    });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comment", error: error.message });
  }
};

// Get comments by Blog ID
exports.getCommentsByBlogId = async (req, res) => {
  const { blog_id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { blog_id },
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Blog, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this Blog." });
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments for the Blog.", error: error.message });
  }
};

// Get comments by User ID
exports.getCommentsByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { user_id },
      include: [
        { model: User, attributes: ['id', 'name'] },
        { model: Blog, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (comments.length === 0) {
      return res.status(404).json({ message: "No comments found for this user." });
    }
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments for the user.", error: error.message });
  }
};

// Update a comment by ID
exports.updateComment = async (req, res) => {
  const { id } = req.params;
  const { content, user_id } = req.body;

  // Check for required fields
  if (!content) {
    return res.status(400).json({ message: "Content is required to update the comment." });
  }

  try {
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Verify that the user has permission to update the comment
    if (comment.user_id !== user_id) {
      return res.status(403).json({ message: "You do not have permission to update this comment." });
    }

    // Update the comment content
    await comment.update({ content });

    res.status(200).json({ message: "Comment updated successfully.", comment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// Delete a comment by ID
exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findOne({ where: { id } });
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    await comment.destroy();

    res.status(200).json({ message: "Comment deleted successfully." });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// **New Method:** Count all comments for a specific Blog
exports.countCommentsForBlog = async (req, res) => {
  const { blog_id } = req.params;

  // Validate the blog_id
  if (!blog_id) {
    return res.status(400).json({ message: "Blog ID is required." });
  }

  try {
    // Verify if the blog exists
    const blog = await Blog.findByPk(blog_id); // Use a lowercase variable name
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Count the number of comments for the Blog
    const commentCount = await Comment.count({
      where: { blog_id },
    });

    res.status(200).json({ blog_id, commentCount });
  } catch (error) {
    console.error("Error counting comments:", error);
    res.status(500).json({ message: "Error counting comments", error: error.message });
  }
};
