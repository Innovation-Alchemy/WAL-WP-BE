module.exports = (sequelize, Sequelize) => {
    const ProductReports = sequelize.define("ProductReports", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        
      },
      report_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,    
      },
    });
  
    return ProductReports;
  };
  