const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Path to app file
const dbConnect = require("./db/dbConnect");

// Mock Mongoose models
jest.mock('./db/userModels', () => ({
    UserInfo: {
        findOne: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    },
    UserPreferences: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    },
    UserVisitedHistory: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    }
}));

jest.mock('./db/restarauntModels', () => ({
    RestaurantInfo: {
        findOne: jest.fn(),
        save: jest.fn(),
    },
}));

const testUserId = '672ed64e8e7fdfa482cd3954';
const invalidUserId = 'invalidUserId';

const mockPreferences = {
    cuisine: ['Italian', 'Chinese'],
    dietaryRestrictions: ['Vegetarian'],
    priceRange: { min: 10, max: 50 },
    location: 'New York',
};

const mockVisitedPlaces = {
    restaurants: [
        { restaurants_id: 'abc123', restaurant_name: 'Restaurant 1', location: 'some street, state, zip code' },
    ]
};

describe('API Endpoints', () => {
    beforeAll(async () => {
        await dbConnect(); // Explicitly connect to the test database
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    // Tests for AIpetite status
    test('GET / - Should return AIpetite status', async () => {
        const res = await request(app).get('/');
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('AIpetite started!');
    });

    // Register endpoint tests
    describe('POST /register', () => {
        const mockUser = {
            email: 'testuser@example.com',
            password: 'password123',
            name: 'Test User',
        };
        it('Should register a new user', async () => {
            // Mock UserInfo.create to return a user object, including the mocked save method
            const mockSave = jest.fn().mockResolvedValue(mockUser); // Mocking save
            require('./db/userModels').UserInfo.create.mockResolvedValue({
                ...mockUser,
                save: mockSave, // Attaching the mocked save method to the created user
            });

            const res = await request(app)
                .post('/register')
                .send(mockUser);
            console.log("Testing result content: ", res.text)
            expect(res.statusCode).toBe(201);
            expect(res.text).toBe('User registered successfully');
            expect(mockSave).toHaveBeenCalled(); // Ensures save() was called as expected
        });

        it('Should not allow duplicate registration', async () => {
            require('./db/userModels').UserInfo.findOne.mockResolvedValue(mockUser);

            const res = await request(app)
                .post('/register')
                .send(mockUser);
            console.log("Testing result content: ", res.text)
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('User already exists');
        });
    });

    // Login endpoint tests
    describe('POST /login', () => {
        it('Should log in an existing user', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'user@test.com', password: '123456' });
            // For some reason the return data is not user@test.com (even though it's in the database)
            // and it keeps return the mockUser above
            console.log("Testing result content: ", res.text);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body).toHaveProperty('token');
        });

        it('Should not log in with incorrect password', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'user@email.com', password: 'wrongpassword' });
            console.log("Testing result content: ", res.text)
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('Wrong passwords');
        });
    });

    // // Visited Places tests
    // describe('GET /visited-places/:user_id', () => {
    //     it('Should retrieve visited places for a user', async () => {
    //         const res = await request(app).get(`/visited-places/${testUserId}`);
    //         console.log("Testing result content: ", res.text)
    //         expect(res.statusCode).toBe(200);
    //         expect(Array.isArray(res.body.restaurants)).toBe(true);
    //     });

    //     it('Should return an error for invalid user ID', async () => {
    //         const invalidUserId = 'invalidUserId';

    //         console.log("Testing result content: ", res.text)
    //         const res = await request(app).get('/visited-places/invalidUserId');
    //         expect(res.statusCode).toBe(404);
    //         expect(res.text).toBe(`Visited places not found for user ID: ${invalidUserId}.`);
    //     });
    // });

    // describe('POST /visited-places/:user_id', () => {
    //     it('Should add a new visited place for a user', async () => {
    //         require('./db/userModels').UserVisitedHistory.create.mockResolvedValue(mockVisitedPlaces);

    //         const res = await request(app)
    //             .post(`/visited-places/${testUserId}`)
    //             .send(mockVisitedPlaces);
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(201);
    //         expect(res.body).toHaveProperty('message', 'Visited place added');
    //     });

    //     it('Should handle errors gracefully', async () => {
    //         const res = await request(app)
    //             .post(`/visited-places/${invalidUserId}`)
    //             .send({});
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(400);
    //     });
    // });

    // // Dining Preferences tests
    // describe('GET /dining-preferences/:user_id', () => {
    //     it('Should retrieve dining preferences for a user', async () => {
    //         require('./db/userModels').UserPreferences.findOne.mockResolvedValue(mockPreferences);

    //         const res = await request(app).get(`/dining-preferences/${testUserId}`);

    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(200);
    //         expect(res.body).toHaveProperty('preferences');
    //     });
    // });

    // describe('POST /dining-preferences/:user_id', () => {
    //     it('Should update dining preferences for a user', async () => {
    //         const updatedPreferences = { cuisine: 'Italian', priceRange: [1, 3] };
    //         require('./db/userModels').UserPreferences.findOne.mockResolvedValue(mockPreferences);

    //         const res = await request(app)
    //             .post(`/dining-preferences/${invalidUserId}`)
    //             .send(updatedPreferences);

    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(200);
    //         expect(res.body).toHaveProperty('message', 'Preferences updated');
    //     });

    //     it('Should handle errors gracefully', async () => {
    //         const res = await request(app)
    //             .post(`/dining-preferences/${invalidUserId}`)
    //             .send({});
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(400);
    //     });
    // });

    // // Nearby Restaurants test
    // describe('POST /nearby-restaurants', () => {
    //     it('Should fetch nearby restaurants', async () => {
    //         const res = await request(app)
    //             .post('/nearby-restaurants')
    //             .send({
    //                 latitude: 37.7749,
    //                 longitude: -122.4194,
    //                 foodType: 'Italian',
    //                 minPrice: 1,
    //                 maxPrice: 3,
    //                 minRating: 4,
    //                 maxDistance: 5
    //             });

    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(200);
    //         expect(Array.isArray(res.body)).toBe(true);
    //     });

    //     it('Should handle missing parameters', async () => {
    //         const res = await request(app)
    //             .post('/nearby-restaurants')
    //             .send({ latitude: 37.7749 });
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(400);
    //         expect(res.text).toBe('Missing required parameters');
    //     });

    //     it('Should handle out-of-range coordinates', async () => {
    //         const res = await request(app)
    //             .post('/nearby-restaurants')
    //             .send({
    //                 latitude: 95.0000,
    //                 longitude: -122.4194,
    //                 foodType: 'Italian',
    //                 minPrice: 1,
    //                 maxPrice: 3,
    //                 minRating: 4,
    //                 maxDistance: 5
    //             });
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(400);
    //         expect(res.text).toBe('Coordinates out of valid range');
    //     });

    //     it('Should handle errors gracefully', async () => {
    //         const res = await request(app)
    //             .post('/nearby-restaurants')
    //             .send({});
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(500);
    //     });
    // });

    // // Place Photos test
    // describe('POST /place-photos', () => {
    //     it('Should fetch photos for a place', async () => {
    //         const res = await request(app)
    //             .post('/place-photos')
    //             .send({ placeId: '12345' });
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(200);
    //         expect(Array.isArray(res.body.photos)).toBe(true);
    //     });

    //     it('Should handle errors gracefully', async () => {
    //         const res = await request(app)
    //             .post('/place-photos')
    //             .send({});
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(400);
    //     });
    // });

    // // Review Fetch test
    // describe('POST /fetch-reviews', () => {
    //     it('Should fetch reviews for a place', async () => {
    //         const res = await request(app)
    //             .post('/fetch-reviews')
    //             .send({ placeId: '12345' });
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(200);
    //         expect(Array.isArray(res.body.reviews)).toBe(true);
    //     });

    //     it('Should handle errors gracefully', async () => {
    //         const res = await request(app)
    //             .post('/fetch-reviews')
    //             .send({});
            
    //         console.log("Testing result content: ", res.text);
    //         expect(res.statusCode).toBe(400);
    //     });
    // });

    // Close connection
    afterAll(async () => {
        await mongoose.connection.close();
    });
});