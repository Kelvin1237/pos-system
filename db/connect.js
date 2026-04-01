const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
});

// FOR SUPABASE CONNECTION ONLY

// USE IN .env
// DATABASE_URL=postgresql://postgres.rwucaemgfcgewoikllpn:eleVIN11!!47!!@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true

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
