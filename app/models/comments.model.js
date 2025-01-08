module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("Comment", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      blog_id: { type: Sequelize.INTEGER, allowNull: true },
      event_id: { type: Sequelize.INTEGER, allowNull: true },
      ads_id: { type: Sequelize.INTEGER, allowNull: true },
      content: { type: Sequelize.TEXT, allowNull: false },
    },{ timestamps: true });
    return Comment;
  };
  