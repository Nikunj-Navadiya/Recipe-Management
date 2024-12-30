const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },
  userId: { type: String, required: true },
  createdOn: { type: Date, default: new Date().getTime() },
  imgUrl: { type: String, default: null }, // Field for image URL
  price: { type: Number, default: 0 }, // New field for price
});

module.exports = mongoose.model("Note", noteSchema);
