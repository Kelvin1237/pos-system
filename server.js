require("dotenv").config();
const express = require("express");
const sequelize = require("./db/connect");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/productRouter");
const userRouter = require("./routes/userRouter");
const salesRouter = require("./routes/salesRouter");
const morgan = require("morgan");
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/sales", salesRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
