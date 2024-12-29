module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define(
    "Notification",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      notification_type:{  type: Sequelize.ENUM("notification", "alert"),
        allowNull: false,
        },
      message: {
        type: Sequelize.STRING, // Notification text
        allowNull: false,
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
