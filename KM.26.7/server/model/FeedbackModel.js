const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    id: {type: Number},
    fullName: {type: String, require:true},
    email:{type: String, unique: true},
    dateOfInduction:{type:Date},
    joiningDate:{type:Date},
    feedbackFor:{type:String},
    presenter:{type:String},
    status: {type: String, default: "Not yet received"},
    question1:{type: Number, default: 0},
    question2:{type: Number, default: 0},
    question3:{type: Number, default: 0},
    question4:{type: Number, default: 0},
    comment:{type: String},
});

const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;