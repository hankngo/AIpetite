const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Path to app file
const dbConnect = require("./db/dbConnect");

// Use the real models and connect to the actual test database
const { UserInfo, UserPreferences, UserVisitedHistory} = require('./db/userModels');
const { RestaurantInfo } = require('./db/restarauntModels');

const testUserId = '672ed64e8e7fdfa482cd3954';
const invalidUserId = 'invalidUserId';

const mockUser = {
    email: 'testuser@example.com',
    password: 'password123',
    name: 'Test User',
};

const mockPreferences = {
    cuisine: ['Italian', 'Chinese'],
    dietaryRestrictions: ['Vegetarian'],
    priceRange: 3,
    location: { 
        lat: 37.775043, 
        long: -122.412832
    }
};


const mockVisitedPlaces = {
    restaurants: [
        { restaurants_id: 'abc123', restaurant_name: 'Restaurant 1', rating: 5, location: 'some street, state, zip code' },
    ]
};

describe('API Endpoints', () => {
    beforeAll(async () => {
        await dbConnect(); // Explicitly connect to the test database
    });

    // Tests for AIpetite status
    test('GET / - Should return AIpetite status', async () => {
        const res = await request(app).get('/');
        expect(res.body).toHaveProperty('status');
        expect(res.body.status).toBe('AIpetite started!');
    });

    // Register endpoint tests
    describe('POST /register', () => {
        it('Should register a new user', async () => {
            const res = await request(app)
                .post('/register')
                .send(mockUser);
            expect(res.statusCode).toBe(201);
            expect(res.text).toBe('User registered successfully');
        });

        it('Should not allow duplicate registration', async () => {
            // Ensure this user is in the database before testing
            const res = await request(app)
                .post('/register')
                .send(mockUser);
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('User already exists');
        });
    });

    // Login endpoint tests
    describe('POST /login', () => {
        it('Should log in an existing user', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'user@email.com', password: '123456' });
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message', 'Login successful');
            expect(res.body).toHaveProperty('token');
        });

        it('Should not log in with incorrect password', async () => {
            const res = await request(app)
                .post('/login')
                .send({ email: 'user@email.com', password: 'wrongpassword' });
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe('Wrong passwords');
        });
    });

    // Get Visited Places tests
    describe('GET /visited-places/:user_id', () => {
        it('Should retrieve visited places for a user', async () => {
            const res = await request(app).get(`/visited-places/${testUserId}`);
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.restaurants)).toBe(true);
        });

        it('Should return an error for invalid user ID', async () => {
            const res = await request(app).get(`/visited-places/${invalidUserId}`);
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe("Invalid user ID type.");
        });
    });

    // Add Visited Place tests
    describe('POST /visited-places/:user_id', () => {
        it('Should add a new visited place for the user', async () => {
            const res = await request(app)
                .post(`/visited-places/${testUserId}`)
                .send(mockVisitedPlaces);
            expect(res.statusCode).toBe(200);
        });

        it('Should return an error for invalid user ID when adding visited places', async () => {
            const res = await request(app)
                .post(`/visited-places/${invalidUserId}`)
                .send(mockVisitedPlaces);
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe("Invalid user ID type.");
        });

        it('Should return an error due to missing an attribute in request body', async () => {
            const res = await request(app)
                .post(`/visited-places/${testUserId}`)
                .send({restaurants: [
                    { restaurants_id: 'abc123', rating: 5, location: 'some street, state, zip code' },
                ]});
            expect(res.statusCode).toBe(500);
        });
    });

    // Get User Preferences tests
    describe('GET /dining-preferences/:user_id', () => {
        it('Should retrieve user preferences', async () => {
            // Add mock preferences before testing
            const res = await request(app).get(`/dining-preferences/${testUserId}`);
            expect(res.statusCode).toBe(200);
        });

        it('Should return an error for invalid user ID', async () => {
            const res = await request(app).get(`/dining-preferences/${invalidUserId}`);
            expect(res.statusCode).toBe(400);
        });
    });

    // Update User Preferences tests
    describe('POST /dining-preferences/:user_id', () => {
        it('Should update user preferences', async () => {
            const res = await request(app)
                .post(`/dining-preferences/${testUserId}`)
                .send(mockPreferences);
            console.log("preferences: ", res.text)
            expect(res.statusCode).toBe(200);
        });

        it('Should return an error for invalid user ID', async () => {
            const updatedPreferences = {
                cuisine: ['Mexican'],
                dietaryRestrictions: ['Gluten-Free'],
                priceRange: { min: 15, max: 60 },
                location: 'California',
            };

            const res = await request(app)
                .post(`/dining-preferences/${invalidUserId}`)
                .send({ preferences: updatedPreferences });
            expect(res.statusCode).toBe(400);
            expect(res.text).toBe("Invalid user ID type.");
        });
    });

    // Close connection
    afterAll(async () => {
        await UserInfo.deleteOne({ email: mockUser.email });
        await mongoose.connection.close(); // Close the database connection after all tests
    });
});