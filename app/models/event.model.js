module.exports = (sequelize, Sequelize) => {
  const Event = sequelize.define("Event", {
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
  }, { timestamps: true });

  return Event;
};
