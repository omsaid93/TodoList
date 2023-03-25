const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const errorHandler = require("./middleWare/errMiddleware");
const userRoute = require("./routes/userRoute");
const todoRoute = require("./routes/todoRoute");
const cors = require("cors");
const path = require("path");

const app = express()

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/todos", todoRoute);

//view engine setup
app.set('view engine','ejs')
app.set('views', path.join(__dirname,'/views/partials'))


app.use(errorHandler);

app.get('/', (req,res)=>{
  res.render('index')
})

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