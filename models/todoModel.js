const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description : {
      type: String,
    },
    endDate : {
      type: Date,
    },
    completed:{
      type : Boolean,
      default:false,
    },
    priority:{
      type: Number,
      default:1,
    },
    children:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todo",
    }],
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
