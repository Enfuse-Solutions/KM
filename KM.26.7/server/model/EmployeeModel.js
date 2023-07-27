const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    id: {type: Number},
    firstName:{type:String, require:true},
    lastName:{type:String, require:true},
    fullName: {type: String, require:true},
    contact: {type: Number},
    email:{type: String, unique: true},
    topics: [
        {
          topic: { type: String },
          score: { type: Number, default: -1 },
          testCount:{type: Number, default: 0}
        }
      ],
    testCount:{type:Number},
    status: {type: String, default: "No"},
    score:{type: Number},
    username:{type: String, default: "username"}, 
    password:{type: String},
    confirmPassword:{type: String},
    role:{type: String, enum: ["Employee", "Admin"], default: "Employee"},
	dateCreated:{type:Date, default: ""},
    createdAt:{type:Date},
    category:{type:String},
    mgrName: {type:String},
    mgrEmail: {type:String}, 
    result:{type:String}
    
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
