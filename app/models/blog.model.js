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
        allowNull: true,
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
     
    },
    { timestamps: true }
  );

  return Blog;
};
