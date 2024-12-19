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
      organizerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ticketPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      totalTickets: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      soldTickets: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  
    return Event;
  };
  