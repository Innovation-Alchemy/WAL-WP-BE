module.exports = (sequelize, Sequelize) => {
    const Advertisement = sequelize.define("Advertisement", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      admin_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      customer_id: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      target_audience: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      images: {
        type: Sequelize.JSON,
        allowNull: true,
      },      
      ads_spend: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
    });
  
    return Advertisement;
  };
  