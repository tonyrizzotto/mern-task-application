const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/mongoose.js');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

//Configure Environment Variables
dotenv.config({ path: './src/config/config.env' });

// Initialize App
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Automatically parse JSON from any request.
app.use(express.json());

// Import Routers
app.use(userRouter);
app.use(taskRouter);

// Activate Server
app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
});
