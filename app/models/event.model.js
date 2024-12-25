module.exports = (sequelize, Sequelize) => {
    const Event = sequelize.define("Event", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      organizer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date_time: {
        type: Sequelize.DATE,//make it an array
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,//make it google maps check google api
        allowNull: false,
      },
      seated: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      links: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },{ timestamps: true });
  
    return Event;
  };
  