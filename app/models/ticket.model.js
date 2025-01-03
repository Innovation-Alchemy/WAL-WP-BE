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
      allowNull: false,
    },
    tickets_sold_count: {
      type: Sequelize.INTEGER,
      defaultValue: 0, // Default to 0
    },
  });

  return Tickets;
};
