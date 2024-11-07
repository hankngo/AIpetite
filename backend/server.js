const express = require("express");
const app = express();
app.use(express.json());
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const fetchNearbyRestaurants = require('./searchRestaurants');

// require database connection
const dbConnect = require("./db/dbConnect");
dbConnect();

// require database schema
const User = require("./db/userModel");

app.listen(5001, () => {
    console.log("NodeJS Server for AIpetite started on port 5001!");
});

app.get("/", (req, res) => {
    res.send({status: "AIpetite started!"});
});

app.post("/register", async(req, res) => {
    const {email, password} = req.body;
    try {
        const oldUser = await User.findOne({email: email});
        if (oldUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser= await User.create({
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
        const oldUser = await User.findOne({email: email});
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

app.post("/nearby-restaurants", async (req, res) => {
    const { latitude, longitude } = req.body;

    try {
        const restaurants = await fetchNearbyRestaurants(latitude, longitude);
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send("Error retrieving nearby restaurants: " + error.message);
    }
});

app.post("/random-restaurant", async (req, res) => {
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
    const { latitude, longitude, usersPreferences } = req.body;

    try {
        // Aggregate preferences
        let foodTypes = [];
        let minPrice = Infinity;
        let maxPrice = -Infinity;

        usersPreferences.forEach(pref => {
            if (pref.foodType) {
                foodTypes.push(pref.foodType);
            }
            if (pref.minPrice !== undefined) {
                minPrice = Math.min(minPrice, pref.minPrice);
            }
            if (pref.maxPrice !== undefined) {
                maxPrice = Math.max(maxPrice, pref.maxPrice);
            }
        });

        // Join food types with OR logic for keyword search
        const foodType = foodTypes.join('|');

        const restaurants = await fetchNearbyRestaurants(latitude, longitude, foodType, minPrice, maxPrice);
		if (restaurants.length === 0) {
            return res.status(404).send("No nearby restaurants found");
        }

        res.status(200).send(restaurants);
    } catch (error) {
        res.status(500).send("Error suggesting restaurants: " + error.message);
    }
});

const calculateMode = (array) => {
    const frequency = {};
    let maxFreq = 0;
    let mode;

    array.forEach(item => {
        frequency[item] = (frequency[item] || 0) + 1;
        if (frequency[item] > maxFreq) {
            maxFreq = frequency[item];
            mode = item;
        }
    });

    return mode;
};

app.post("/group-restaurant", async (req, res) => {
    const { latitude, longitude, usersPreferences } = req.body;

    if (!Array.isArray(usersPreferences)) {
        return res.status(400).send("Invalid input: usersPreferences should be an array");
    }

    try {
        // Aggregate preferences
        let foodTypes = [];
        let minPrices = [];
        let maxPrices = [];

        usersPreferences.forEach(pref => {
            if (pref.foodType) {
                foodTypes.push(pref.foodType);
            }
            if (pref.minPrice !== undefined) {
                minPrices.push(pref.minPrice);
            }
            if (pref.maxPrice !== undefined) {
                maxPrices.push(pref.maxPrice);
            }
        });

        // Calculate mode for each field
        const foodType = calculateMode(foodTypes);
        const minPrice = calculateMode(minPrices);
        const maxPrice = calculateMode(maxPrices);

        const restaurants = await fetchNearbyRestaurants(latitude, longitude, foodType, minPrice, maxPrice);

        if (restaurants.length === 0) {
            return res.status(404).send("No nearby restaurants found");
        }

        // Select the best restaurant (assuming the first restaurant is the best match)
        const selectedRestaurant = restaurants[0];

        res.status(200).send(selectedRestaurant);
    } catch (error) {
        res.status(500).send("Error selecting group restaurant: " + error.message);
    }
});