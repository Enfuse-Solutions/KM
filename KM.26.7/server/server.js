// 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const emailRouter = require("./routes/EmailRouter.js")
const questionRouter = require("./routes/QuestionRouter.js");
const employeeRouter = require("./routes/EmployeeRouter.js");
const feedbackRouter = require("./routes/FeedbackRouter.js")
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

async function main() {
  await mongoose.connect(process.env.URL);
    await mongoose.connection.db.collection('km').createIndex({ username: 1 }, { unique: true });
    console.log('db connected.');
}

main().catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

 
app.use(employeeRouter);
app.use(emailRouter)
app.use(questionRouter);
app.use(feedbackRouter)



app.listen(8080, () => {
  console.log('server started')
})