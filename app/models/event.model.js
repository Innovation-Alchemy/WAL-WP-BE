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
        type: Sequelize.JSON, // Storing location as a JSON object
        allowNull: false,
      },
      ticket_maps: {
        type: Sequelize.STRING, // Storing as a URL or a reference
        allowNull: true,
      },
      commission: {
        type: Sequelize.JSON, // Updated to store both percentage and flat commission as JSON
        allowNull: false,
        defaultValue: { percentage: "3.0", flat: "0.0" }, // Default commission
      },
      tags: {
        type: Sequelize.JSON, // Storing tags as an array of strings
        allowNull: true,
        defaultValue: [], // Default to an empty array
      },
      image: {
        type: Sequelize.STRING, // Path or URL to the uploaded image
        allowNull: true,
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default is not approved
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default is not approved
      },
      status: {
        type: Sequelize.ENUM("pending", "in-progress", "canceled", "done"),
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