const axios = require('axios');

const fetchplaceImage = async (placeId) => {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const place = response.data.result;

    if (place.photos && place.photos.length > 0) {
      const photoReference = place.photos[0].photo_reference;
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
      return photoUrl;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching place image:', error);
    throw error;
  }
};

module.exports = fetchplaceImage;