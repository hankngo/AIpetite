const express = require("express");
const app = express();
const mongoose = require("mongoose");
const {UserInfo, UserPreferences, UserVisitedHistory, UserSavedPlaces} = require("./db/userModels");
const { RestaurantInfo } = require("./db/restarauntModels");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
app.use(cors());
const fetchReviews = require('./components/fetchReviews');
const generateDescription = require('./components/descGenerator');
const fetchNearbyRestaurants = require('./components/searchRestaurants');
const fetchplaceImage = require('./components/placePhotos');
app.use(express.json());
dotenv.config();



const dbConnect = require("./db/dbConnect");
dbConnect();

app.listen(5001, () => {
    console.log("NodeJS Server for AIpetite started on port 5001!");
});

app.get("/", (req, res) => {
    res.send({status: "AIpetite started!"});
});

app.post("/register", async(req, res) => {
    const {email, password, name} = req.body;
    try {
        const oldUser = await UserInfo.findOne({email: email});
        if (oldUser) {
            return res.status(400).send("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser= await UserInfo.create({
            email: email,
            password: hashedPassword,
            name: name,
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
                { user_id: oldUser._id, email: oldUser.email },
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            );
            res.status(200).send({
                message: "Login successful",
                user_id: oldUser._id,
                email: oldUser.email,
                name: oldUser.name,
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
    const { latitude, longitude, foodType, minPrice, maxPrice, minRating, maxDistance } = req.body;

    try {
        const restaurants = await fetchNearbyRestaurants(latitude, longitude, foodType, minPrice, maxPrice, minRating, maxDistance);

        for (const restaurant of restaurants) {
            restaurant.photoUrl = await fetchplaceImage(restaurant.place_id);
        }

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
    const { latitude, longitude, userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).send("Invalid input: userIds should be a non-empty array");
    }

    try {
        const userPreferences = await UserPreferences.find({ user_id: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) } });

        if (userPreferences.length === 0) {
            return res.status(404).send("No dining preferences found for the provided user IDs");
        }

        // Aggregate preferences
        let foodTypes = [];
        let minPrices = [];
        let maxPrices = [];

        userPreferences.forEach(pref => {
            if (pref.cuisine) {
                foodTypes.push(...pref.cuisine);
            }
            if (pref.priceRange && pref.priceRange.min !== undefined) {
                minPrices.push(pref.priceRange.min);
            }
            if (pref.priceRange && pref.priceRange.max !== undefined) {
                maxPrices.push(pref.priceRange.max);
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
    const { latitude, longitude, userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).send("Invalid input: userIds should be a non-empty array");
    }

    try {
        const userPreferences = await UserPreferences.find({ user_id: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) } });

        if (userPreferences.length === 0) {
            return res.status(404).send("No dining preferences found for the provided user IDs");
        }

        // Aggregate preferences
        let foodTypes = [];
        let minPrices = [];
        let maxPrices = [];

        userPreferences.forEach(pref => {
            if (pref.cuisine) {
                foodTypes.push(...pref.cuisine);
            }
            if (pref.priceRange && pref.priceRange.min !== undefined) {
                minPrices.push(pref.priceRange.min);
            }
            if (pref.priceRange && pref.priceRange.max !== undefined) {
                maxPrices.push(pref.priceRange.max);
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

app.get("/restaurant/:place_id", async (req, res) => {
  const { place_id } = req.params;

  try {
    // Check if the restaurant details are in the cache
        // Check if the restaurant details are in the database
        let restaurant = await RestaurantInfo.findOne({ place_id });

        if (!restaurant) {
          // Fetch restaurant details from the API
          const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${process.env.GOOGLE_API_KEY}`);
          const ai_description = await axios.post('http://localhost:5001/generate-description', { placeId: place_id });
          const description = ai_description.data.description;
          const data = response.data.result;
          console.log(response);
          console.log(ai_description);

          // Create a new restaurant document
          restaurant = new RestaurantInfo({
            place_id,
            name: data.name,
            location: data.formatted_address,
            rating: data.rating,
            description: description, // Example description from reviews
            photoUrl: data.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${data.photos[0].photo_reference}&key=${process.env.GOOGLE_API_KEY}` : null,
            website: data.website || '',
          });
          console.log(restaurant);

          // Save the restaurant details to the database
          await restaurant.save();
        }

        res.status(200).json(restaurant);
      }
        catch (error) {
            res.status(500).send("Error fetching restaurant details: " + error.message);
        }
    });
  
    
    
    app.post('/generate-description', async (req, res) => {
      const { placeId } = req.body;
      try {
        // Fetch reviews and generate a new description
        const reviews = await fetchReviews(placeId);
        let description = await generateDescription(reviews);
        description = description.content;

        res.status(200).send({ description });
      } catch (error) {
        res.status(500).send('Error generating description: ' + error.message);
      }
    });

    

app.post("/save-restaurant", async (req, res) => {
  const { userId, restaurantId, name, location } = req.body;

  try {
    const objectId  = userId.replace(/['"]+/g, ''); 
    // Check if the restaurant is already in the user's saved list
    let userSavedPlaces = await UserSavedPlaces.findOne({ user_id: objectId });
    if (userSavedPlaces && userSavedPlaces.restaurants.some(r => r.restaurants_id === restaurantId)) {
      return res.status(400).send("Restaurant already saved");
    }

    // Add the restaurant to the user's saved list
    if (userSavedPlaces) {
      userSavedPlaces.restaurants.push({
        restaurants_id: restaurantId,
        restaurant_name: name,
        location: location,
      });
      await userSavedPlaces.save();
    } else {
      await UserSavedPlaces.create({
        user_id: userId,
        restaurants: [{
          restaurants_id: restaurantId,
          restaurant_name: name,
          location: location,
        }],
      });
    }

    res.status(200).send("Restaurant saved successfully");
  } catch (error) {
    res.status(500).send("Error saving restaurant: " + error.message);
  }
});