// controllers/like.controller.js
const db = require("../models");
const Like = db.likes;
const Blog = db.Blog;
const User = db.User;

// Get all likes
exports.getAllLikes = async (req, res) => {
  try {
    const likes = await Like.findAll({
      include: [
        { model: User, attributes: ['id', 'name',] },
        { model: Blog, attributes: ['id', 'title', 'user_id'] }, // Include Blog owner ID
      ],
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes", error: error.message });
  }
};

// Add a new like
exports.addLike = async (req, res) => {
  const { user_id, blog_id } = req.body;

  // Validate required fields
  if (!user_id || !blog_id) {
    return res.status(400).json({ message: "User ID and Blog ID are required." });
  }

  try {
    // Verify the user exists
    const liker = await User.findByPk(user_id);
    if (!liker) {
      return res.status(404).json({ message: "User not found." });
    }

    // Verify the blog exists
    const blog = await Blog.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Prevent liking own blog (optional)
    if (blog.user_id === user_id) {
      return res.status(400).json({ message: "Users cannot like their own Blogs." });
    }

    // Check for duplicate likes
    const existingLike = await Like.findOne({ where: { user_id, blog_id } });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this Blog." });
    }

    // Create the like
    const newLike = await Like.create({ user_id, blog_id });

    // Send the response
    res.status(201).json(newLike);
  } catch (error) {
    console.error("Error adding like:", error);
    res.status(500).json({ message: "Error adding like", error: error.message });
  }
};


// Get a like by ID
exports.getLikeById = async (req, res) => {
  const { id } = req.params;
  try {
    const like = await Like.findOne({
      where: { id },
      include: [
        { model: User, attributes: ['id', 'name',] },
        { model: Blog, attributes: ['id', 'title'] },
      ],
    });
    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }
    res.status(200).json(like);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving like", error: error.message });
  }
};

// Get likes by Blog ID
exports.getLikesByBlogId = async (req, res) => {
  const { blog_id } = req.params;
  try {
    const likes = await Like.findAll({
      where: { blog_id },
      include: [
        { model: User, attributes: ['id', 'name',] },
        { model: Blog, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (likes.length === 0) {
      return res.status(404).json({ message: "No likes found for this Blog." });
    }
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes for the Blog.", error: error.message });
  }
};

// Get likes by User ID
exports.getLikesByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const likes = await Like.findAll({
      where: { user_id },
      include: [
        { model: User, attributes: ['id', 'name',] },
        { model: Blog, attributes: ['id', 'title'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    if (likes.length === 0) {
      return res.status(404).json({ message: "No likes found for this user." });
    }
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving likes for the user.", error: error.message });
  }
};

// Remove a like
exports.removeLike = async (req, res) => {
  const { user_id, blog_id } = req.body;

  // Check for required fields
  if (!user_id || !blog_id) {
    return res.status(400).json({ message: "User ID and Blog ID are required." });
  }

  try {
    const like = await Like.findOne({ where: { user_id, blog_id } });
    if (!like) {
      return res.status(404).json({ message: "Like not found." });
    }

    await like.destroy();

    res.status(200).json({ message: "Like removed successfully." });
  } catch (error) {
    console.error("Error removing like:", error);
    res.status(500).json({ message: "Error removing like", error: error.message });
  }
};

// Get likes by Blog ID along with the count
exports.getLikesCountByBlogId = async (req, res) => {
  const { blog_id } = req.params;

  try {
    // Verify if the blog exists
    const blog = await Blog.findByPk(blog_id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Retrieve likes with user and blog details
    const likes = await Like.findAll({
      where: { blog_id },
      include: [
        {
          model: User,
          attributes: ["id", "name"],
        },
        {
          model: Blog,
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Count the total likes for the blog
    const likeCount = await Like.count({ where: { blog_id } });

    res.status(200).json({ likeCount, likes });
  } catch (error) {
    console.error("Error retrieving likes for the Blog:", error);
    res.status(500).json({ message: "Error retrieving likes for the Blog.", error: error.message });
  }
};