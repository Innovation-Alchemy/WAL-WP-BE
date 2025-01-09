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
db.Coupon = require("./coupon.model")(sequelize, Sequelize);
db.Category = require("./category.model")(sequelize, Sequelize);
db.Permission = require ("./permission.model")(sequelize, Sequelize);
db.Product = require ("./product.model")(sequelize, Sequelize);
db.Hobby = require ("./hobby.model")(sequelize, Sequelize);
db.profile_Details= require ("./profile_details.model")(sequelize, Sequelize);
db.comments = require("./comments.model")(sequelize, Sequelize);
db.likes = require("./likes.model")(sequelize, Sequelize);
db.views = require("./views.model")(sequelize, Sequelize);
db.TicketsSold = require("./tickets_sold.model")(sequelize, Sequelize);
db.ProductPurchase = require("./product_purchase.model")(sequelize, Sequelize);
db.notification =require("./notification.model")(sequelize, Sequelize);
db.News = require("./news.model")(sequelize, Sequelize);
db.Advertisement = require("./advertisement.model")(sequelize, Sequelize);
db.PasswordResetToken = require("./password_reset_token.model")(sequelize, Sequelize);
db.Report = require("./report.model")(sequelize, Sequelize);
db.Tags = require("./tags.model")(sequelize, Sequelize);
db.BlogTags = require("./blog_tags.model")(sequelize, Sequelize);
db.EventTags = require("./event_tags.model")(sequelize, Sequelize);
db.ProductTags = require("./product_tags.model")(sequelize, Sequelize);
db.BlogReports = require("./blog_reports.model")(sequelize, Sequelize);
db.EventReports = require("./event_reports.model")(sequelize, Sequelize);
db.ProductReports = require("./product_reports.model")(sequelize, Sequelize);
db.Stock = require("./stock.model")(sequelize, Sequelize);
db.Cart = require("./cart.model")(sequelize, Sequelize);
db.Rating = require("./ratings.model")(sequelize, Sequelize);


// Define Relationships
db.User.hasMany(db.Event, { foreignKey: "organizer_id", onDelete: "CASCADE" });
db.Event.belongsTo(db.User, { foreignKey: "organizer_id" });
 
db.Ticket.hasMany(db.TicketsSold, { foreignKey: "ticket_id", onDelete: "CASCADE" });
db.TicketsSold.belongsTo(db.Ticket, { foreignKey: "ticket_id" });

db.User.hasMany(db.TicketsSold, { foreignKey: "buyer_id", onDelete: "CASCADE" });
db.TicketsSold.belongsTo(db.User, { foreignKey: "buyer_id" });

db.Event.hasMany(db.Ticket, { foreignKey: "event_id", onDelete: "CASCADE" });
db.Ticket.belongsTo(db.Event, { foreignKey: "event_id" });

db.User.hasMany(db.Blog, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Blog.belongsTo(db.User, { foreignKey: "user_id" });

db.Event.hasMany(db.Coupon, { foreignKey: "event_id", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.Event, { foreignKey: "event_id" });

db.User.hasMany(db.Product, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Product.belongsTo(db.User, { foreignKey: "user_id" });

db.Product.hasMany(db.Coupon, { foreignKey: "product_id", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.Product, { foreignKey: "product_id" });

db.User.hasMany(db.Coupon, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Coupon.belongsTo(db.User, { foreignKey: "user_id" });

db.Product.hasMany(db.Rating, { foreignKey: "product_id", onDelete: "CASCADE" });
db.Rating.belongsTo(db.Product, { foreignKey: "product_id" });

db.User.hasMany(db.Rating, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Rating.belongsTo(db.User, { foreignKey: "user_id" });


//User and Cart (one-to-many)
db.User.hasMany(db.Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
db.Cart.belongsTo(db.User, { foreignKey: "user_id" });

// Tags relationships for Blog, Event, Product
db.Tags.belongsToMany(db.Blog, { through: "BlogTags", foreignKey: "tag_id", onDelete: "CASCADE" });
db.Blog.belongsToMany(db.Tags, { through: "BlogTags", foreignKey: "blog_id", onDelete: "CASCADE" });

db.Tags.belongsToMany(db.Event, { through: "EventTags", foreignKey: "tag_id", onDelete: "CASCADE" });
db.Event.belongsToMany(db.Tags, { through: "EventTags", foreignKey: "event_id", onDelete: "CASCADE" });

db.Tags.belongsToMany(db.Product, { through: "ProductTags", foreignKey: "tag_id", onDelete: "CASCADE" });
db.Product.belongsToMany(db.Tags, { through: "ProductTags", foreignKey: "product_id", onDelete: "CASCADE" });

// Report relationships for Blog, Event, Product
db.Report.belongsToMany(db.Blog, { through: "BlogReports", foreignKey: "report_id", onDelete: "CASCADE" });
db.Blog.belongsToMany(db.Report, { through: "BlogReports", foreignKey: "blog_id", onDelete: "CASCADE" });

db.Report.belongsToMany(db.Event, { through: "EventReports", foreignKey: "report_id", onDelete: "CASCADE" });
db.Event.belongsToMany(db.Report, { through: "EventReports", foreignKey: "event_id", onDelete: "CASCADE" });

db.Report.belongsToMany(db.Product, { through: "ProductReports", foreignKey: "report_id", onDelete: "CASCADE" });
db.Product.belongsToMany(db.Report, { through: "ProductReports", foreignKey: "product_id", onDelete: "CASCADE" });

//Products and Stocks (one-to-many)
db.Product.hasMany(db.Stock, { foreignKey: "product_id", onDelete: "CASCADE" });
db.Stock.belongsTo(db.Product, { foreignKey: "product_id" });

//Events and Products (one-to-many)
db.Event.hasMany(db.Product, { foreignKey: "event_id", onDelete: "CASCADE" });
db.Product.belongsTo(db.Event, { foreignKey: "event_id" });

//Blogs and Products (one-to-many)
db.Blog.hasMany(db.Product, { foreignKey: "blog_id", onDelete: "CASCADE" });
db.Product.belongsTo(db.Blog, { foreignKey: "blog_id" });

// Events and Categories (one-to-one)
db.Event.hasOne(db.Category, { foreignKey: "categories", onDelete: "CASCADE" });
db.Category.belongsTo(db.Event, { foreignKey: "categories" });

// Products and Categories (one-to-one)
db.Product.hasOne(db.Category, { foreignKey: "categories", onDelete: "CASCADE" });
db.Category.belongsTo(db.Product, { foreignKey: "categories" });

// User and PasswordResetToken (one-to-many)
db.User.hasMany(db.PasswordResetToken, { foreignKey: "user_id", onDelete: "CASCADE" });
db.PasswordResetToken.belongsTo(db.User, { foreignKey: "user_id" });

// Advertisement and user role admin  (Many-to-one)
db.Advertisement.belongsTo(db.User, { foreignKey: "admin_id", onDelete: "CASCADE" });
db.User.hasMany(db.Advertisement, { foreignKey: "admin_id", onDelete: "CASCADE" });

// News and user role admin  (Many-to-one)
db.News.belongsTo(db.User, { foreignKey: "admin_id", onDelete: "CASCADE" });
db.User.hasMany(db.News, { foreignKey: "admin_id", onDelete: "CASCADE" });

// User - Notification association (User has many notifications)
db.User.hasMany(db.notification, { foreignKey: "user_id", onDelete: "CASCADE" });
db.notification.belongsTo(db.User, { foreignKey: "user_id" });

// Blog - Notification association (Blog has many notifications)
db.Blog.hasMany(db.notification, { foreignKey: "blog_id", onDelete: "CASCADE" });
db.notification.belongsTo(db.Blog, { foreignKey: "blog_id" });

// Product - Notification association (Product has many notifications)
db.Product.hasMany(db.notification, { foreignKey: "product_id", onDelete: "CASCADE" });
db.notification.belongsTo(db.Product, { foreignKey: "product_id" });

// Event - Notification association (Event has many notifications)
db.Event.hasMany(db.notification, { foreignKey: "event_id", onDelete: "CASCADE" });
db.notification.belongsTo(db.Event, { foreignKey: "event_id" });

// Product and ProductPurchase (one-to-many)
db.Product.hasMany(db.ProductPurchase, { foreignKey: "product_id", onDelete: "CASCADE" });
db.ProductPurchase.belongsTo(db.Product, { foreignKey: "product_id" });

// User and ProductPurchase (one-to-many)
db.User.hasMany(db.ProductPurchase, { foreignKey: "user_id", onDelete: "CASCADE" });
db.ProductPurchase.belongsTo(db.User, { foreignKey: "user_id" });


// User and Permissions (one-to-one)
db.User.hasOne(db.Permission, { foreignKey: "permissions", onDelete: "CASCADE" });
db.Permission.belongsTo(db.User, { foreignKey: "permissions" });

// User and Profile Details (one-to-one)
db.User.hasOne(db.profile_Details, { foreignKey: "user_id", onDelete: "CASCADE" });
db.profile_Details.belongsTo(db.User, { foreignKey: "user_id" });

// User and Hobby (one-to-one)
db.User.hasOne(db.Hobby, { foreignKey: "hobbies", onDelete: "CASCADE" });
db.Hobby.belongsTo(db.User, { foreignKey: "hobbies" });

// User - Comment association (User can create many comments)
db.User.hasMany(db.comments, { foreignKey: "user_id", onDelete: "CASCADE" });
db.comments.belongsTo(db.User, { foreignKey: "user_id" });

// User - Like association (User can like many blogs)
db.User.hasMany(db.likes, { foreignKey: "user_id", onDelete: "CASCADE" });
db.likes.belongsTo(db.User, { foreignKey: "user_id" });

// User - Views association (User can view many blogs)
db.User.hasMany(db.views, { foreignKey: "user_id", onDelete: "CASCADE" });
db.views.belongsTo(db.User, { foreignKey: "user_id" });

// Blog - Views association (Track users who viewed a blog)
db.Blog.hasMany(db.views, { foreignKey: "blog_id", onDelete: "CASCADE" });
db.views.belongsTo(db.Blog, { foreignKey: "blog_id" });

// Blog - Like association (blog can have many likes)
db.Blog.hasMany(db.likes, { foreignKey: "blog_id", onDelete: "CASCADE" });
db.likes.belongsTo(db.Blog, { foreignKey: "blog_id" });

// Blog - Comment association (blog has many comments)
db.Blog.hasMany(db.comments, { foreignKey: "blog_id", onDelete: "CASCADE" });
db.comments.belongsTo(db.Blog, { foreignKey: "blog_id" });

// Sync models with database
/*sequelize.sync({ alter: true })
  .then(() => {
    console.log("All models synchronized successfully.");
  })
  .catch((error) => {
    console.error("Error synchronizing models:", error);
  });*/

module.exports = db;
