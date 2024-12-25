module.exports = (sequelize, Sequelize) => {
    const Views = sequelize.define("View", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      blog_id: { type: Sequelize.INTEGER, allowNull: false },
    },{ timestamps: true });
    return Views;
  };
  