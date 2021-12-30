import mongoose from 'mongoose'
// const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    c_name: { type: String, default: null },
    c_number: { type: String, default: null },
    date: { type: String, default: null },
    invoice_num: { type: String, default: null },
    book_list: { type: Array, default: [] },
});

module.exports = mongoose.models.sales || mongoose.model('sales', saleSchema);
