const feedbackRouter = require("express").Router();
const CryptoJS = require("crypto-js");

const Feedback = require("../model/FeedbackModel");

//Create User - or register, a simple post request to save user in db
feedbackRouter.post("/register/feedback", (req, res) => {
  const newUser = new Feedback({
    fullName: req.body.fullName,
    email: req.body.email,
    status: req.body.status,
    dateOfInduction:req.body.dateOfInduction,
    createdAt: req.body.createdAt,
    joiningDate: req.body.joiningDate,
    feedbackFor: req.body.feedbackFor,
    presenter: req.body.presenter,
    question1:req.body.question1,
    question2:req.body.question2,
    question3:req.body.question3,
    question4:req.body.question4,
    createdAt: req.body.createdAt,
    comment:req.body.comment,
  });


  newUser.save()
    .then((user) => {

      res.json(user);
    })
    .catch((err) => {
      if (err.code === 11000) {

        res.status(409).json({ message: "Email already in use" });
      } else {
        res.status(400).json({ message: "Could not create user" });
      }
    });
})
feedbackRouter.get("/feedback/:email", async (req, res) => {
  try {
    const email = req.params.email;
    const feedbackData = await Feedback.find({ email: email });
    res.status(200).json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback data:", error);
    res.status(500).json({ message: "Error fetching feedback data" });
  }
});

//update records
feedbackRouter.put('/feedback/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Feedback.findByIdAndUpdate(_id, req.body, { new: true });
    if (!result) {
      res.json({
        status: "FAILED",
        message: "record is not updated successfully"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records updated successfully",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }
})



//Delete records
feedbackRouter.delete("/feedback/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Feedback.findByIdAndDelete(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "records is Delete successfully"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records not Delete successfully",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }
})


module.exports = feedbackRouter;