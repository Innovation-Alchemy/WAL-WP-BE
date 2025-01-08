module.exports = (sequelize, Sequelize) => {
  const Tickets = sequelize.define("Tickets", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    event_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    waves: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    amount_issued: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    issued_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    price: {
      type: Sequelize.JSON, // Array of {color, price}
      allowNull: false,
    },
    section: {
      type: Sequelize.JSON, // Array of {color, section}
      allowNull: false,
    },
    total_seats: {
      type: Sequelize.JSON, // Array of {section, seats}
      allowNull: true,// if event is not seated, this will be null
    },
    tickets_sold_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0, // Default to 0
    },
    tickets_sold_count_sum_price: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    },
    ticket_alert: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 10, // Default to 10
    },
  });

  return Tickets;
};
