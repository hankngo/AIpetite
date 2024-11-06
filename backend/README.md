# AIpetite Backend

This repository contains the backend for the AIpetite application, which handles user registration, authentication, and data storage using MongoDB. It is built using Node.js, Express, and MongoDB (via Mongoose).

## Requirements

Before running the server, ensure that you have run the following command line to install all packages installed at root directorry `~/AIpetite`:
   ```bash
   npm install
   ```

## Run the Server
1. Navigate to the backend directory: Change into the `backend` directory where the backend code is located:
    ```bash
    cd AIpetite/server
    ```
2. Setup MongoDB connection:
    - Create a `.env` file in the `server` directory.
    - Add the following line to the `.env` file, replacing with MongoDB Atlas credentials:
    ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority
    ```
3. Now, run the backend server, use the following command:
    ```bash
    npx nodemon server.js
    ```
    The backend server will start and listen on port 5001 by default.