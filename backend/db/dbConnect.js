// external imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from AIpetite/backend/.env'
dotenv.config();

// connect to the database with mongoose
async function dbConnect() {
	mongoose
		.connect(process.env.DB_URL)
		.then(() => console.log("MongoDB Atlas connected successfully!"))
		.catch((error) => console.error("MongoDB Atlas connection error:", error));
}
// export dbConnect() to house the connection
module.exports = dbConnect;