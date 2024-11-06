# AIpetite

## Requirements

- Node.js and npm installed
- MongoDB Atlas or local MongoDB connection (configured in `.env` file)

## Getting Started

1. **Clone the Repository:**
    In your teminal,
   ```bash
   git clone <repository-url>
   cd AIpetite
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```


## Run the backend first
1. **Navigate to the backend directory**: 

    Change into the `backend` directory where the backend code is located:
    ```bash
    cd AIpetite/server
    ```
2. **Setup MongoDB connection**:
    - Create a `.env` file in the `server` directory.
    - Add the following line to the `.env` file, replacing with MongoDB Atlas credentials:
    ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority
    ```
3. Now, **run the backend server**, use the following command:
    ```bash
    npx nodemon server.js
    ```
    The backend server will start and listen on port 5001 by default.


## Run the frontend
1. **Navigate to the frontend folder:**


    Open a new terminal:
    ```bash
    cd frontend
    ```
2. **Start the frontend application:**
    ```bash
    npm start
    ```
    The project should now be running with the backend on port 5001 and the frontend on its designated port (usually 3000).

## Making Changes
- **IMPORTANT** Please don't directly push to main ever
- For any **new feature** you’re working on, you should **create a new branch** and **making changes on your own branch**.
- Branches should be named {frontend/backend/...}/{your_name}/{feature_name}.
    - For example:  `frontend/anthony/authenticationUI`

- If possible, organizing your work by keeping backend and frontend changes in separate branches.

- When ready to merge, or if you encounter merge conflicts and need assistance, consult the team.