const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// FOR SUPABASE CONNECTION ONLY

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
//   logging: false,
// });

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("Connected to database successfully!");
//   } catch (error) {
//     console.error("Unable to connect to database", error);
//   }
// })();

module.exports = sequelize;
