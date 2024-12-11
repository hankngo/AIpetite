const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
	{
		email: {type: String, required: true, unique: true},
		password: {type: String, required: true},
        name: { type: String, required: true },
	},
	{
		collection: "UserInfo",
	}
);

const UserPreferencesSchema = new mongoose.Schema(
	{
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", required: true, unique: true },
        cuisine: { type: String, default: 'None' },
        dietaryRestrictions: { type: String, default: 'None' },
        diet: { type: String, default: 'None' },
        serviceType: { type: String, default: 'Any' },
        mealType: { type: String, default: 'Any' },
        distance: { type: String, default: 'Any' },
        rating: { type: String, default: 'Any' },
      },
      {
        collection: "UserPreferences",
      }
);

const UserSavedPlacesSchema = new mongoose.Schema(
    {
        user_id: {type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", require: true, unique:true},
        restaurants: [
            {
                _id: false,
                restaurants_id: {type: String, required: true, unique: true},
                restaurant_name: {type: String, required: true},
                location: {type: String, required: true, unique: true},
            }
        ]
    },
    {
        collection: "UserSavedPlaces"
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
                location: {type: String, required: true, unique: true},
                rating: {type: Number, required: true},
            }
        ]
    },
    {
        collection: "UserVisitedHistory"
    }
);

const UserInfo = mongoose.model("UserInfo", UserSchema);
const UserPreferences = mongoose.model("UserPreferences", UserPreferencesSchema);
const UserVisitedHistory = mongoose.model("UserVisitedHistory", UserVisitedPlacesSchema);
const UserSavedPlaces = mongoose.model("UserSavedPlaces", UserSavedPlacesSchema);

module.exports = {UserInfo, UserPreferences, UserVisitedHistory, UserSavedPlaces};