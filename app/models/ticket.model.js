module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("Ticket", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      eventId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      buyerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      qrCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM("Valid", "Used", "Cancelled"),
        defaultValue: "Valid",
      },
      purchaseDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  
    return Ticket;
  };
  