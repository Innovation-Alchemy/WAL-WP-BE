module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("Ticket", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      qrCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      ticket_price: {
        type: Sequelize.JSON, //  make it array of prices
        allowNull: false,
      },
      section: {
        type: Sequelize.JSON, // section array of objects[{color,A}]
        allowNull: false,
      },
      total_seats: {
        type: Sequelize.JSON, // array of seats
        allowNull: false,
      },
      total_tickets: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tickets_sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    
    },{ timestamps: true });
  
    return Ticket;
  };
  