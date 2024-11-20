const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
	{
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
	},
	{
		collection: "UserInfo",
	}
);

const UserPreferencesSchema = new mongoose.Schema(
	{
		user_id: {type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", require: true, unique:true},
        cuisine: [String],
        dietaryRestrictions: [String],
        priceRange: {type: Number},
        location: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true },
        },
	},
    {
        collection: "UserPreferences"
    }
);

const UserVisitedPlacesSchema = new mongoose.Schema(
    {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", require: true, unique:true},
        restaurants: [
            {
                _id: false,
                restaurants_id: {type: String, required: true, unique: true},
                restaurant_name: {type: String, required: true},
                location: {type: String, required: true, unique: true}
            }
        ]
    },
    {
        collection: "UserVisitedHistory"
    }
);

const RestaurantSchema = new mongoose.Schema(
    {
        restaurant_name: {type: String, required: true},
        location: {type: String, required: true, unique: true}
    },
    {
        collection: "RestaurantInfo"
    }
);

const ReviewSchema = new mongoose.Schema(
    {
        restaurant_id: {type: mongoose.Schema.Types.ObjectId, ref: "RestaurantInfo", require: true, unique:true},
        rating: {type: Number, required: true, min: 1, max: 5},
        comment: {type: String, required: false, maxlength: 500},
    },
    {
        collection: "ReviewInfo"
    }
);

const UserInfo = mongoose.model("UserInfo", UserSchema);
const UserPreferences = mongoose.model("UserPreferences", UserPreferencesSchema);
const UserVisitedHistory = mongoose.model("UserVisitedHistory", UserVisitedPlacesSchema);
const RestaurantInfo = mongoose.model("RestaurantInfo", RestaurantSchema);
const ReviewInfo = mongoose.model("ReviewInfo", ReviewSchema);

module.exports = {UserInfo, UserPreferences, UserVisitedHistory, RestaurantInfo, ReviewInfo};