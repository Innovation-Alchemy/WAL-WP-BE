module.exports = (sequelize, Sequelize) => {
    const Like = sequelize.define("Likes", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      blog_id: { type: Sequelize.INTEGER, allowNull: false },
      
    },{ timestamps: true });
    return Like;
  };
  