const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorHandler = require("./middleWare/errMiddleware");
const userRoute = require("./routes/userRoute");
const todoRoute = require("./routes/todoRoute");
const cors = require("cors");

const app = express()

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/todos", todoRoute);

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use(errorHandler);

const database_url = "localhost:27017";
const database_name = "todoTest";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});

const URL = `mongodb://${database_url}/${database_name}`;
mongoose
  .connect(URL)
  .then(() => {
    console.log(`connected successfuly to the DB`);
  })
  .catch((err) => console.log(err));