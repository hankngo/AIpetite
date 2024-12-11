# AIpetite

## Requirements

- Node.js and npm installed
- MongoDB Atlas or local MongoDB connection (configured in `.env` file)

## Getting Started

1. **Clone the Repository:**
    In your terminal,
   ```bash
   git clone <repository-url>
   cd AIpetite
   ```

2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Make sure all IP address strings are changed to your IP address.**

## Run the backend first
1. **Navigate to the backend directory**: 

    Change into the `backend` directory where the backend code is located:
    ```bash
    cd AIpetite/backend
    ```
2. **Setup services connection**:
    - Create a `.env` file in the `backend` directory.
    ```bash
    touch .env
    ```
    - Add the following line to the `.env` file, replacing with MongoDB Atlas credentials and Google Places API:
    ```bash
    DB_URL=mongodb+srv://cmpe133_team5:<password>@freecluster.5t8hw.mongodb.net/?retryWrites=true&w=majority&appName=FreeCluster
    GOOGLE_API_KEY=<key_value>
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
    npx expo start
    ```
    The project should now be running with the backend on port 5001 and the frontend on its designated port (usually 3000).
   
3. **If running on Mac, use iOS simulator by pressing 'i' key:**
    ```bash
    › Press i │ open iOS simulator
    ```
3. **Once simulator is loaded, press "Command + d" and enable Fast Refresh so you do not have to reload app after each edit:**
    ```bash
    Command + d
    ```
## Making Changes
- **IMPORTANT** Please don't directly push to the main ever
- For any **new feature** you’re working on, you should **create a new branch** and **make changes on your own branch**.
- Branches should be named {your_name}/{frontend/backend/...}/{feature_name}.
    - For example:  `anthony/frontend/authenticationUI`

- If possible, organize your work by keeping backend and frontend changes in separate branches.

- When ready to merge, or if you encounter merge conflicts and need assistance, consult the team.

## Testing

1. **Check if Port 5001 is Running**

Before running the tests, ensure that port 5001 is not in use by any other process.

    To check if port 5001 is occupied, run the following command:

```bash
lsof -i :5001
```

If any processes are occupying port 5001, you'll see output indicating the process IDs. To kill these processes, run:

```bash
kill -9 <PID>
```
- Replace <PID> with the process ID(s) from the previous command.

2. **Navigate to the Backend Directory**

After ensuring port 5001 is available, navigate to the backend directory:

```bash
cd backend
```
3. **Run the Tests**

Once you're in the backend directory, you can run the tests with:

```bash
npm test
```