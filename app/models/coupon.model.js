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
      product_id: {
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
        allowNull: true,
      },
      discount_in_dollar: {
        type: Sequelize.DOUBLE,
        allowNull: true,
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
      allowed_uses_per_user: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      valid_from: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      used_by_users: {
        type: Sequelize.JSON, // Store as an array of user IDs
        allowNull: true,
        defaultValue: [], // Default to an empty array
      },
    
    },{ timestamps: true });
  
    return Coupon;
  };
  