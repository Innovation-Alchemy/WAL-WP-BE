const db = require('../models');
const News = db.News;
const { newsValidationSchema } = require('../utils/validations');
const { Op } = require('sequelize');

// CREATE NEWS
exports.createNews = async (req, res) => {
  // Validate input
  const { error } = newsValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details });
  }

  const { admin_id, title, content, category, published_at } = req.body;

  try {
    // Handle images
    const images = req.files
      ? req.files.map(file => {
          return process.env.NODE_ENV === 'production'
            ? `https://irada/${file.path.replace(/\\/g, '/')}`
            : `http://localhost:8080/${file.path.replace(/\\/g, '/')}`;
        })
      : [];

    // Create a News record (no language or translation logic)
    const newNews = await News.create({
      admin_id,
      title,
      content,
      category,
      published_at,
      images
    });

    res.status(201).json({
      message: 'News created successfully',
      data: newNews
    });
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Error creating news', error });
  }
};

// GET ALL NEWS
exports.getAllNews = async (req, res) => {
  try {
    // Simply fetch all News from the DB
    const newsList = await News.findAll();

    res.status(200).json({
      message: "News fetched successfully",
      data: newsList,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// GET NEWS BY ID
exports.getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findByPk(id);

    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    res.status(200).json({
      message: "News fetched successfully",
      data: news,
    });
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ message: "Error fetching news", error });
  }
};

// UPDATE NEWS
exports.updateNews = async (req, res) => {
  const { id } = req.params;
  const { admin_id, title, content, category, published_at } = req.body;

  try {
    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    const updatedFields = {};

    if (admin_id !== undefined) updatedFields.admin_id = admin_id;
    if (title !== undefined) updatedFields.title = title;
    if (content !== undefined) updatedFields.content = content;
    if (category !== undefined) updatedFields.category = category;
    if (published_at !== undefined) updatedFields.published_at = published_at;

    if (req.files && req.files.length > 0) {
      const images = req.files.map(file => {
        return process.env.NODE_ENV === 'production'
          ? `https://irada/${file.path.replace(/\\/g, '/')}`
          : `http://localhost:8080/${file.path.replace(/\\/g, '/')}`;
      });
      updatedFields.images = images;
    }

    await news.update(updatedFields);

    res.status(200).json({
      message: 'News updated successfully',
      data: news,
    });
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Error updating news', error });
  }
};

// DELETE NEWS
exports.deleteNews = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findByPk(id);
    if (news) {
      await news.destroy();
      res.status(200).json({ message: 'News deleted successfully' });
    } else {
      res.status(404).json({ message: 'News not found' });
    }
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Error deleting news', error });
  }
};

// SEARCH NEWS BY TITLE (in the original table only)
exports.searchNews = async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ message: "Please provide a title to search." });
  }

  try {
    const newsList = await News.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      }
    });

    res.status(200).json({
      message: "News fetched successfully",
      data: newsList,
    });
  } catch (error) {
    console.error("Error searching news by title:", error);
    res.status(500).json({ message: "Error searching news", error });
  }
};

// FILTER NEWS BY CATEGORY (in the original table only)
exports.filterNewsByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ message: "Please provide a category to filter." });
  }

  try {
    const newsList = await News.findAll({ where: { category } });

    res.status(200).json({
      message: "News fetched successfully",
      data: newsList,
    });
  } catch (error) {
    console.error("Error filtering news by category:", error);
    res.status(500).json({ message: "Error filtering news", error });
  }
};
