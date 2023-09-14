const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const Todo = new Schema({
  text: {
    type: String,
    require: true,
  },
  isCompleted: {
    type: Boolean,
    require: true,
  },
  dateTime: {
    type: Date,
    default: Date.now(),
    require: true,
  },
});

module.exports = Mongoose.model("todos", Todo);
