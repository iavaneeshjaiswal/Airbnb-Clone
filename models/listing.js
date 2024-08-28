const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    url: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/drawing-hotel-called-hotel-called-hotel_1196893-373.jpg",
      set: (v) =>
        v === ""
          ? "https://img.freepik.com/premium-vector/drawing-hotel-called-hotel-called-hotel_1196893-373.jpg"
          : v,
    },
  },
  price: { type: Number, default: 0 },
  location: { type: String },
  country: { type: String },
});

module.exports = mongoose.model("listing", listSchema);
