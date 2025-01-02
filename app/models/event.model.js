module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define(
    "Event",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      date_time: {
        type: Sequelize.JSON, // Storing date and time as an array
        allowNull: false,
      },
      location: {
        type: Sequelize.JSON, // Storing location as a JSON object with lat/lng
        allowNull: false,
      },
      seated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      ticket_maps: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      commission: {
        type: Sequelize.DECIMAL(5, 2), // Percentage as a decimal value
        allowNull: false,
        defaultValue: 3.0, // Default commission is 3%
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default is not approved
      },
      ticket_alert: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "in-progress", "canceled","done"),
        defaultValue: "pending",
      },
      total_revenue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.0, // Default total revenue is 0
      },
      
    },
    { timestamps: true }
  );

  return Event;
};
