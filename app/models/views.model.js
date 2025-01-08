module.exports = (sequelize, Sequelize) => {
    const Views = sequelize.define("View", {
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      blog_id: { type: Sequelize.INTEGER, allowNull: true },
      event_id: { type: Sequelize.INTEGER, allowNull: true },
      ads_id: { type: Sequelize.INTEGER, allowNull: true },

    },{ timestamps: true });
    return Views;
  };
  