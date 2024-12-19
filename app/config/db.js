/*
This file exports a configuration object for connecting to a MySQL database,
 using values from environment variables and specifying connection pool settings.
 It sets up the database host, user, password, database name, dialect, port, and connection pool options. */

 require("dotenv").config();

 module.exports = {
   HOST: process.env.DB_HOST,
   USER: process.env.DB_USER,
   PASSWORD: process.env.DB_PASSWORD,
   DB: process.env.DB_DATABASE,
   dialect: "mysql",
   port: process.env.DB_PORT || 3306, // Default to 3306 if not set
   pool: {
     max: 5,
     min: 0,
     acquire: 60000,
     idle: 10000,
   },
 };
 