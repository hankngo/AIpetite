const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    place_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    photoUrl: { type: String, required: true },
    website: { type: String, required: true },
  },
  {
    collection: "Restaurants",
  }
);

const RestaurantInfo = mongoose.model("RestaurantInfo", RestaurantSchema);

module.exports = { RestaurantInfo };