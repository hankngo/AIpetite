const axios = require('axios');

const fetchNearbyRestaurants = async (latitude, longitude, foodType = '', minPrice, maxPrice, openNow = false) => {
    const apiKey = process.env.GOOGLE_API_KEY;

    const params = {
        location: `${latitude},${longitude}`,
        radius: '1500',
        type: 'restaurant',
        key: apiKey,
        keyword: foodType || undefined, // Set undefined if empty
        minprice: minPrice,
        maxprice: maxPrice,
        opennow: openNow ? 'true' : undefined // Only adding if true
    };

    // Filter out undefined parameters
    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined)
    );

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${new URLSearchParams(filteredParams)}`;

    try {
        const response = await axios.get(url);
        const restaurants = response.data.results;

        // Sorts by distance (assuming the API returns results sorted by distance)
        // Then sorts by rating
        restaurants.sort((a, b) => {
            if (a.geometry.location.lat === b.geometry.location.lat && a.geometry.location.lng === b.geometry.location.lng) {
                return b.rating - a.rating; // Sort by rating if distances are equal
            }
            return 0; // Keep the original order by distance
        });

        return restaurants;
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        throw error;
    }
};

module.exports = fetchNearbyRestaurants;