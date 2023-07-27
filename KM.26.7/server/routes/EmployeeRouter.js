const employeeRouter = require("express").Router();
const CryptoJS = require("crypto-js");

const Employee = require("../model/EmployeeModel");
const emailRouter = require("./EmailRouter");

//Create User - or register, a simple post request to save user in db
employeeRouter.post("/register/employee", (req, res) => {
  const newUser = new Employee({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    fullName: req.body.fullName,
    category: req.body.category,
    email: req.body.email,
    testCount: req.body.testCount,
    status: req.body.status,
    topics:req.body.topics,
    createdAt: req.body.createdAt,
    dateOfInduction:req.body.dateOfInduction,
    joiningDate:req.body.joiningDate,
    feedbackFor:req.body.feedbackFor,
    presenter:req.body.presenter,
    mgrEmail: req.body.mgrEmail,
    mgrName: req.body.mgrName,
    question1:req.body.question1,
    question2:req.body.question2,
    question3:req.body.question3,
    question4:req.body.question4,
    question5:req.body.question5,
    question6:req.body.question6,
    comment:req.body.comment,
   
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString(),
    role: req.body.role,
   
    confirmPassword: req.body.confirmPassword
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

// user login
employeeRouter.post("/api/login", (req, res) => {
  Employee.findOne({ email: req.body.email }) // Change from username to email
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        const decryptedPassword = CryptoJS.AES.decrypt(
          user.password,
          process.env.PASSWORD_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8);
        
        if (decryptedPassword !== req.body.password) {
          res.json({ message: "Incorrect password" });
        } else {
          res.status(200).json(user);
        }
      }
    })
    .catch((err) => res.status(400).json({ message: "Could not login user" }));
});


employeeRouter.get('/employees', async (req, res) => {
  const docs = await Employee.find({ role: "Employee" });
  res.json(docs)
})

//update the feedbackform data

employeeRouter.put("/employee/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body; // Assuming req.body contains both the employee and feedback form data

  // If the request contains the 'password' field, encrypt it using CryptoJS
  if (req.body.password) {
    updatedData.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASSWORD_SECRET_KEY
    ).toString();
  }

  Employee.findByIdAndUpdate(
    id,
    { $set: updatedData },
    { new: true }
  )
    .then((updatedEmployee) => {
      if (updatedEmployee) {
        res.json(updatedEmployee);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to update employee details" });
    });
});


employeeRouter.get('/employees/:email', async (req, res) => {
  const docs = await Employee.find({ email: req.params.email });
  res.json(docs)
})

employeeRouter.get('/employees/:id', async (req, res) => {
  const docs = await Employee.find({ id: req.params.id });
  res.json(docs)
})

employeeRouter.get('/employee/induction', async (req, res) => {
  const docs = await Employee.find({ category: "Induction" });
  res.json(docs)
})

employeeRouter.get('/employee/assessment', async (req, res) => {
  const docs = await Employee.find({ category : "Assessment" });
  res.json(docs)
})

employeeRouter.put('/employee/:id/resetScore', async (req, res) => {
  const { id } = req.params;
  const { topicId, newScore } = req.body;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const topicToUpdate = employee.topics.find(
      (topic) => topic._id.toString() === topicId
    );

    if (!topicToUpdate) {
      return res.status(404).json({ message: 'Topic not found' });
    }

    topicToUpdate.score = newScore;
    await employee.save();

    return res.status(200).json({ message: 'Score reset successfully' });
  } catch (error) {
    console.error('Error resetting score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


employeeRouter.put("/employee/:id/topics", (req, res) => {
  const { id } = req.params;
  const updatedTopics = req.body.topics; // Assuming req.body.topics is the updated array of topics with "topic" and "score" properties

  Employee.findByIdAndUpdate(
    id,
    { topics: updatedTopics },
    { new: true }
  )
    .then((updatedEmployee) => {
      if (updatedEmployee) {
        res.json(updatedEmployee);
      } else {
        res.status(404).json({ message: "Employee not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to update employee topics" });
    });
});


employeeRouter.get("/employee/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Employee.findById(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "records not found on this ID"
      })
    }
    else {
      res.json({
        status: "SUCCESS",
        message: "records found",
        data: result
      })
    }
  }
  catch (e) {
    res.send(e)
  }

})

//update records
employeeRouter.put('/employee/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Employee.findByIdAndUpdate(_id, req.body, { new: true });
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
employeeRouter.delete("/employee/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Employee.findByIdAndDelete(_id);
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

// PUT endpoint to update the score of a respective topic for an employee
employeeRouter.put('/employees/:employeeId/topics/:topicId', async (req, res) => {
  const { employeeId, topicId } = req.params;
  const { score } = req.body;

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find the topic in the employee's topics array by ID
    const topicToUpdate = employee.topics.id(topicId);

    if (!topicToUpdate) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Update the score of the specific topic
    topicToUpdate.score = score;

    // Save the updated employee document
    await employee.save();

    return res.json(employee);
  } catch (err) {
    console.error('Error updating score:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

employeeRouter.delete("/admin/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const result = await Employee.findByIdAndDelete(_id);
    if (!result) {
      res.json({
        status: "FAILED",
        message: "Failed to delete the record"
      });
    } else {
      res.json({
        status: "SUCCESS",
        message: "Record deleted successfully",
        data: result
      });
    }
  } catch (e) {
    res.status(500).json({
      status: "ERROR",
      message: "An error occurred during deletion",
      error: e.message
    });
  }
});



module.exports = employeeRouter;
