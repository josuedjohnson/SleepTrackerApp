require("dotenv").config();
const express = require("express");//allows for express to be used
const mongoose = require("mongoose");//allows for data to be sent to db easily
const cors = require("cors");//allows for cross-origin resource sharing (backend can interact with frontend)
const authRoutes = require('./routes/auth');//import the router from the auth.js file
const sleepRoutes = require('./routes/sleep'); //import the router from the sleep.js file

//initializing the express app
const app = express();
const PORT = process.env.PORT || 5001;

// Configure CORS
app.use(cors({
  origin: "http://localhost:5174", // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

//middleware
app.use(express.json());

//connecting mongoose to the mongoDB database
mongoose.connect(process.env.MONGODB_URL,)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Routes
app.use('/auth', authRoutes);
app.use('/sleep', sleepRoutes); 

app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
