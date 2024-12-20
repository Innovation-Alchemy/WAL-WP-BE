const dbConfig = require("../config/db");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.port,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.User = require("./user.model")(sequelize, Sequelize);
db.Event = require("./event.model")(sequelize, Sequelize);
db.Ticket = require("./ticket.model")(sequelize, Sequelize);
db.Blog = require("./blog.model")(sequelize, Sequelize);
db.Advertisement = require("./advertisement.model")(sequelize, Sequelize);
db.Notification = require("./notification.model")(sequelize, Sequelize);
db.Payment = require("./payment.model")(sequelize, Sequelize);
db.Venue = require("./venue.model")(sequelize, Sequelize);
db.Coupon = require("./coupon.model")(sequelize, Sequelize);
db.Category = require("./category.model")(sequelize, Sequelize);
db.Permission = require ("./permission.model")(sequelize, Sequelize);

// Define Relationships
db.User.hasMany(db.Event, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Event.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Ticket, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Ticket.belongsTo(db.User, { foreignKey: "user_id" });

db.Event.hasMany(db.Ticket, { foreignKey: "event_id", onDelete: "CASCADE" });
db.Ticket.belongsTo(db.Event, { foreignKey: "event_id" });

db.User.hasMany(db.Blog, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Blog.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Advertisement, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Advertisement.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Notification, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Notification.belongsTo(db.User, { foreignKey: "user_id" });

db.User.hasMany(db.Payment, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Payment.belongsTo(db.User, { foreignKey: "user_id" });

db.Venue.hasMany(db.Event, { foreignKey: "venue_id", onDelete: "CASCADE" });
db.Event.belongsTo(db.Venue, { foreignKey: "venue_id" });

db.Event.hasMany(db.Coupon, { foreignKey: "event_id", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.Event, { foreignKey: "event_id" });

db.User.hasMany(db.Coupon, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.User, { foreignKey: "user_id" });

// User and Permissions (one-to-one)
db.User.hasOne(db.Permission, { foreignKey: "permissions", onDelete: "CASCADE" });
db.Permission.belongsTo(db.User, { foreignKey: "permissions" });

// Sync models with database
/*sequelize.sync({ alter: true })
  .then(() => {
    console.log("All models synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing models:", error);
  });*/

module.exports = db;
