module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define("Comment", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      blog_id: { type: Sequelize.INTEGER, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
    },{ timestamps: true });
    return Comment;
  };
  