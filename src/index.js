const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

// Automatically parse JSON from any request.
app.use(express.json());

// Import Routers
app.use(userRouter);
app.use(taskRouter);

// Activate Server
app.listen(port, () => {
  console.log(`Application is running on port: ${port}`);
});
