module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      blog_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      price:  {
        type: Sequelize.DOUBLE, 
        allowNull: false,
      },
      image: {
        type: Sequelize.JSON, 
        allowNull: true,
      },    
      size: {
        type: Sequelize.JSON, 
        allowNull: false,
      },
      color: {
        type: Sequelize.JSON, 
        allowNull: false,
      },
      commission: {
        type: Sequelize.DECIMAL(5, 2), // Percentage as a decimal value
        allowNull: false,
        defaultValue: 100.0, // Default commission is 100%
      },
      is_approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default is not approved
      },
      categories: {
        type: Sequelize.JSON, // Store as JSON
        allowNull: true,
        defaultValue: [], // Default to an empty array
      },
    },
    { timestamps: true }
  );

  return Product;
};
