module.exports = (sequelize, Sequelize) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      tags: {
        type: Sequelize.JSON, // Stores tags as an array
        allowNull: true,
      },
      files: {
        type: Sequelize.JSON, // Stores file paths as an array
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: Sequelize.JSON, // Stores comments as an array of objects
        allowNull: true,
        defaultValue: [],
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // Initialize with 0 views
      },
    },
    { timestamps: true }
  );

  return Blog;
};
