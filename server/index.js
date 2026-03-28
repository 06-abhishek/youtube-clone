import dotenv from "dotenv";
import connectDB from "./config/mongoDB.js";
import app from "./app.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}!`);
});
