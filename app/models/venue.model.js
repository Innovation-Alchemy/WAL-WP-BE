module.exports = (sequelize, Sequelize) => {
    const Venue = sequelize.define("Venue", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      layout: {
        type: Sequelize.JSON,
        allowNull: true,
      },
    });
  
    return Venue;
  };
  