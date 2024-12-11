const axios = require('axios');

const fetchReviews = async (placeId) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    const reviews = response.data.result.reviews || [];
    return reviews.map(review => review.text);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

module.exports = fetchReviews;