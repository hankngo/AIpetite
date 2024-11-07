const mongoose = require("mongoose");
const UserPreferencesSchema = new mongoose.Schema(
	{
		userId: {type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", require: true},
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
)
module.exports = mongoose.model("UserPreferences", UserPreferencesSchema);