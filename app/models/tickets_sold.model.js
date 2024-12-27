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
    seat_number: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    color: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("pending", "reserved", "purchased", "canceled"),
      defaultValue: "pending",
    },
    total_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    qr_code: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    tickets_sold_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0, // Default to 0
    },
  });

  return TicketsSold;
};
