
module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define("News", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
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
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    published_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    images: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    language: {
      type: Sequelize.ENUM('en', 'ar'),
      allowNull: false,
      defaultValue: 'en'
    },
  }, { timestamps: true });

  return News;
};