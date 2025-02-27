const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
require("dotenv").config(); // Ensure dotenv is imported at the top

// Parse requests of content-type - application/json
app.use(express.json());
app.use(cors());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

const db = require("./app/models");

db.sequelize
  .sync({
    // force: true, // Uncomment to drop and recreate tables
    // alter: true, // Uncomment to update tables
  })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


  const server = http.createServer(app);


// Routes
// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to We Are Lebanon Website." });
});
// Import routes
require("./app/routes/user.routes")(app);
require("./app/routes/blog.routes")(app);
require("./app/routes/category.routes")(app);
require("./app/routes/coupon.routes")(app);
require("./app/routes/event.routes")(app);
require("./app/routes/ticket.routes")(app);
require("./app/routes/tickets_sold.routes")(app);
require("./app/routes/permission.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/hobby.routes")(app);
require("./app/routes/profile_details.routes")(app);
require("./app/routes/likes.routes")(app);
require("./app/routes/comments.routes")(app);
require("./app/routes/views.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/product_purchase.routes")(app);
require("./app/routes/notification.routes")(app);
require("./app/routes/combined_data.routes")(app);
require("./app/routes/news.routes")(app);
require("./app/routes/advertisement.routes")(app);
require("./app/routes/forget_password_token.routes")(app);
require("./app/routes/report.routes")(app);
require("./app/routes/tags.routes")(app);
require("./app/routes/blog_tags.routes")(app);
require("./app/routes/event_tags.routes")(app);
require("./app/routes/product_tags.routes")(app);
require("./app/routes/blog_reports.routes")(app);
require("./app/routes/event_reports.routes")(app);
require("./app/routes/product_reports.routes")(app);
require("./app/routes/stock.routes")(app);
require("./app/routes/cart.routes")(app);
require("./app/routes/rating.routes")(app);
require("./cron");

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
