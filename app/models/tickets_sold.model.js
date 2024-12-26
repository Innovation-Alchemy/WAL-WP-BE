module.exports = (sequelize, Sequelize) => {
    const TicketsSold = sequelize.define("Tickets_Sold", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      buyer_id: {// user_id for the user who bought the ticket
        type: Sequelize.INTEGER,
        foreignKey: true, 
        allowNull: false,
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        foreignKey: true, 
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending','reserved','purchased','confirmed'),
        defaultValue: "pending",
      },
      ticket_sold: {
        type: Sequelize.JSON, // Array of {seat, ticket, section}
        defaultValue: [],
      },
      qr_code: { 
        type: Sequelize.STRING
     },
    });
  
    return TicketsSold;
  };
  