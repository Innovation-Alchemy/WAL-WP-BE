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
// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
