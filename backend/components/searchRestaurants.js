const axios = require('axios');

const fetchNearbyRestaurants = async (latitude, longitude, foodType = '', minPrice, maxPrice, minRating = 0, maxDistance = 1500) => {
    const apiKey = process.env.GOOGLE_API_KEY;

    const params = {
        location: `${latitude},${longitude}`,
        radius: maxDistance,
        type: 'restaurant',
        key: apiKey,
        keyword: foodType || undefined, // Set undefined if empty
        minprice: minPrice,
        maxprice: maxPrice,
    };

    // Filter out undefined parameters
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined)
    );

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${new URLSearchParams(filteredParams)}`;

    try {
        const response = await axios.get(url);
        let restaurants = response.data.results;

        // Filter by rating
        restaurants = restaurants.filter(restaurant => restaurant.rating >= minRating);

        // Sort by distance (assuming the API returns results sorted by distance)
        // Then sort by rating
        restaurants.sort((a, b) => b.rating - a.rating);

        return restaurants;
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        throw error;
    }
};

module.exports = fetchNearbyRestaurants;