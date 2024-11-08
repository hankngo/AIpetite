const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {UserInfo, UserPreferences, UserVisitedHistory} = require("./db/userModels");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const dotenv = require('dotenv');
app.use(express.json());
dotenv.config();

const fetchNearbyRestaurants = require('./searchRestaurants');

const dbConnect = require("./db/dbConnect");
dbConnect();

app.listen(5001, () => {
    console.log("NodeJS Server for AIpetite started on port 5001!");
});

app.get("/", (req, res) => {
    res.send({status: "AIpetite started!"});
});

app.post("/register", async(req, res) => {
    const {email, password} = req.body;
    try {
        const oldUser = await UserInfo.findOne({email: email});
        if (oldUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser= await UserInfo.create({
            email: email,
            password: hashedPassword,
        });
        await newUser.save();
        return res.status(201).send("User registered successfully");
    } catch (error) {
        return res.status(500).send("Error registering user: " + error.message);
    }
});

app.post("/login", async(req, res) => {
    const {email, password} = req.body;
    try {
        const oldUser = await UserInfo.findOne({email: email});
        if (!oldUser) {
            return res.status(400).send("User does not exist");
        }

        if (await bcrypt.compare(password, oldUser.password)) {
            const token = jwt.sign(
                {email: oldUser.email},
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            );
            res.status(200).send({
                message: "Login successful",
                email: oldUser.email,
                token,
            });
        } else {
            return res.status(400).send("Wrong passwords");
        }
    } catch (error) {
        return res.status(500).send("Error logging in: " + error.message);
    }
});

app.get("/visited-places/:user_id", async(req, res) => {
	const {user_id} = req.params;
	try {
		if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(400).send("Invalid user ID type.");
		if (!await UserInfo.findById(user_id)) return res.status(404).send("User not found.");

		const visitedPlaces = await UserVisitedHistory.findOne({user_id: new mongoose.Types.ObjectId(user_id)});
		if (!visitedPlaces) return res.status(404).send(`Visited places not found for user ID: ${user_id}.`);
		res.status(200).json(visitedPlaces);
	} catch (error) {
		res.status(500).send("Error retrieving visited places: " + error.message);
	}
});

app.post("/visited-places/:user_id", async(req, res) => {
	const {user_id} = req.params;
	const {restaurants} = req.body;
	try {
		if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(400).send("Invalid user ID type.");
		if (!await UserInfo.findById(user_id)) return res.status(404).send("User not found.");
		if (!restaurants || !restaurants.length) res.status(500).send(`No restaurants found for user ID: ${user_id} due to server issue.`);

		const visitedPlaces = await UserVisitedHistory.findOne({user_id: new mongoose.Types.ObjectId(user_id)});
		if (!visitedPlaces) {
			const newVisitedPlaces = await UserVisitedHistory.create({user_id: user_id, restaurants});
			await newVisitedPlaces.save();
			return res.status(201).send("Visited places created successfully.");
		} else {
			visitedPlaces.restaurants = restaurants;
			await visitedPlaces.save();
			res.status(200).send("Visited places updated successfully.");
		}
	} catch (error) {
		res.status(500).send("Error handling visited places: " + error.message);
	}
});

app.get("/dining-preferences/:user_id", async(req, res) => {
	const {user_id} = req.params;
	try {
		if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(400).send("Invalid user ID type.");
		if (!await UserInfo.findById(user_id)) return res.status(404).send("User not found.");

		const preferences = await UserPreferences.findOne({user_id: new mongoose.Types.ObjectId(user_id)});
		if (!preferences) return res.status(404).send(`Dining preferences not found for user ID: ${user_id}.`);
    	res.status(200).json(preferences);
	} catch (error) {
		res.status(500).send("Error retrieving dining preferences: " + error.message);
	}
});

app.post("/dining-preferences/:user_id", async(req, res) => {
	const {user_id} = req.params;
	const {cuisine, dietaryRestrictions, priceRange, location} = req.body;
	try {
		if (!mongoose.Types.ObjectId.isValid(user_id)) return res.status(400).send("Invalid user ID type.");
		if (!await UserInfo.findById(user_id)) return res.status(404).send("User not found.");

		const preferences = await UserPreferences.findOne({user_id: new mongoose.Types.ObjectId(user_id)});
		if (!preferences) {
			const newPreferences = await UserPreferences.create({user_id: user_id, cuisine, dietaryRestrictions, priceRange, location});
			await newPreferences.save();
			return res.status(201).send("Dining preferences created successfully.");
		} else {
			preferences.cuisine = cuisine;
			preferences.dietaryRestrictions = dietaryRestrictions;
			preferences.priceRange = priceRange;
			preferences.location = location;
			await preferences.save();
			res.status(200).send("Dining preferences updated successfully.");
		}
	} catch (error) {
		res.status(500).send("Error handling dining preferences: " + error.message);
	}
});

// Suggestion: delete user dining-preferences request in DB if have app has user deactivate feature


app.post("/nearby-restaurants", async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const restaurants = await fetchNearbyRestaurants(latitude, longitude);
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send("Error retrieving nearby restaurants: " + error.message);
    }
});

app.post("/random-restaurants", async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const restaurants = await fetchNearbyRestaurants(latitude, longitude);

        if (restaurants.length === 0) {
            return res.status(404).send("No nearby restaurants found");
        }

        const randomIndex = Math.floor(Math.random() * restaurants.length);
        const randomRestaurant = restaurants[randomIndex];

        res.status(200).send(randomRestaurant);
    } catch (error) {
        res.status(500).send("Error generating random restaurant recommendation: " + error.message);
    }
});

app.post("/suggest-restaurants", async (req, res) => {
    const { latitude, longitude, foodType, minPrice, maxPrice, openNow } = req.body;

    try {
        const restaurants = await fetchNearbyRestaurants(latitude, longitude, foodType, minPrice, maxPrice, openNow);
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send("Error suggesting restaurants: " + error.message);
    }
});