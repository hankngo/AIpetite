import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

const ReviewsScreen = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Dummy data for reviews
    const dummyReviews = [
      {
        restaurantName: 'The Burger Joint',
        restaurantImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        reviewText: 'The burgers here are amazing! Highly recommend the classic cheese burger.',
        date: '2024-11-10',
        rating: 5,
      },
      {
        restaurantName: 'Pasta Paradise',
        restaurantImage: 'https://randomuser.me/api/portraits/women/2.jpg',
        reviewText: 'Delicious pasta dishes, but the service could have been faster.',
        date: '2024-11-09',
        rating: 4,
      },
      {
        restaurantName: 'Sushi World',
        restaurantImage: 'https://randomuser.me/api/portraits/men/2.jpg',
        reviewText: 'Best sushi I’ve ever had, very fresh and flavorful.',
        date: '2024-11-08',
        rating: 5,
      },
    ];

    // Set the dummy reviews data
    setReviews(dummyReviews);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Popular Reviews</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.restaurantImage }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.reviewRestaurant}>{review.restaurantName}</Text>
                  <Text style={styles.reviewRating}>Rating: {review.rating}/5</Text>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.reviewText}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noReviews}>No reviews available yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffaa00',
    marginBottom: 20,
    
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  reviewContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#ffaa00',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  reviewRestaurant: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffaa00',
  },
  reviewRating: {
    fontSize: 14,
    color: '#888',
  },
  reviewText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  reviewDate: {
    fontSize: 14,
    color: '#888',
    textAlign: 'right',
  },
  noReviews: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReviewsScreen;
