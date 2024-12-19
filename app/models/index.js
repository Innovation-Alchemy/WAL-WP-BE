const dbConfig = require("../config/db");
const Sequelize = require("sequelize");

// Initialize Sequelize with configuration
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.DIALECT,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

// Database Object
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
db.User.hasMany(db.Event, { foreignKey: "organizerId", onDelete: "CASCADE" });
db.Event.belongsTo(db.User, { foreignKey: "organizerId" });

db.User.hasMany(db.Ticket, { foreignKey: "buyerId", onDelete: "CASCADE" });
db.Ticket.belongsTo(db.User, { foreignKey: "buyerId" });

db.Event.hasMany(db.Ticket, { foreignKey: "eventId", onDelete: "CASCADE" });
db.Ticket.belongsTo(db.Event, { foreignKey: "eventId" });

db.User.hasMany(db.Blog, { foreignKey: "authorId", onDelete: "CASCADE" });
db.Blog.belongsTo(db.User, { foreignKey: "authorId" });

db.User.hasMany(db.Advertisement, { foreignKey: "createdBy", onDelete: "CASCADE" });
db.Advertisement.belongsTo(db.User, { foreignKey: "createdBy" });

db.User.hasMany(db.Notification, { foreignKey: "userId", onDelete: "CASCADE" });
db.Notification.belongsTo(db.User, { foreignKey: "userId" });

db.User.hasMany(db.Payment, { foreignKey: "userId", onDelete: "CASCADE" });
db.Payment.belongsTo(db.User, { foreignKey: "userId" });

db.Venue.hasMany(db.Event, { foreignKey: "venueId", onDelete: "CASCADE" });
db.Event.belongsTo(db.Venue, { foreignKey: "venueId" });

db.Event.hasMany(db.Coupon, { foreignKey: "eventId", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.Event, { foreignKey: "eventId" });

db.User.hasMany(db.Coupon, { foreignKey: "createdBy", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.User, { foreignKey: "createdBy" });

// User and Permissions (one-to-one)
db.User.hasOne(db.Permission, { foreignKey: "permissions", onDelete: "CASCADE" });
db.Permission.belongsTo(db.User, { foreignKey: "permissions" });

// Sync models with database
sequelize.sync({ alter: true })
  .then(() => {
    console.log("All models synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing models:", error);
  });

module.exports = db;
