module.exports = (sequelize, Sequelize) => {
  const TicketsSold = sequelize.define("Ticket_Sold", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    buyer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    ticket_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    section: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    seat: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending","reserved", "sold","canceled","used"),
      defaultValue: "pending",
    },
    reserved_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    qr_code: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    qr_code_token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  });

  return TicketsSold;
};
