module.exports = (sequelize, DataTypes) => {
    const BlogTags = sequelize.define("BlogTags", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,      
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
    });
  
    return BlogTags;
  };
  