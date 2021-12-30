const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  author: { type: String, default: null },
  book_name: { type: String, default: null },
  inStock: { type: String, default: null },
  inStockArr: { type: Array, default: [] },
  price: { type: String, default: null },
});

module.exports = mongoose.models.books || mongoose.model("books", bookSchema);