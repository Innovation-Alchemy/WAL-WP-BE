module.exports = (sequelize, Sequelize) => {
    const Coupon = sequelize.define("Coupon", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      event_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      coupon_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      discount_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      discount_in_dollar: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      min_price:{
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      max_uses: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      current_uses: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    
    });
  
    return Coupon;
  };
  