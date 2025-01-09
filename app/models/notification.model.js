module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: { type: Sequelize.INTEGER, allowNull: true },
      event_id: { type: Sequelize.INTEGER, allowNull: true },
      blog_id: { type: Sequelize.INTEGER, allowNull: true },
      product_id: { type: Sequelize.INTEGER, allowNull: true },
      notification_type: {
        type: Sequelize.ENUM(
          "organizer-approval",
          "event-approval",
          "blog-approval",
          "product-approval",
        ),
        allowNull: true,
      },
      alerts: {
        type: Sequelize.ENUM(
          "low-stock",
          "low-tickets",
          "report-event",
          "report-blog",
          "report-product"
        ),
        allowNull: true,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      date_time: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    },
    { timestamps: true }
  );

  return Notification;
};
