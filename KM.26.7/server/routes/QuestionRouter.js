const questionRouter = require("express").Router();
const Questionaire = require('../model/QuestionModel');

// POST a new question for a specific category
questionRouter.post('/question/:topic', async (req, res) => {
  const { question, options, correctAnswer, mark, createdAt } = req.body;
  const { topic } = req.params;
  const newQuestionaire = new Questionaire({
    question,
    options,
    correctAnswer,
    mark,
    topic,
    createdAt,
  });
  try {
    const savedQuestionaire = await newQuestionaire.save();
    res.json(savedQuestionaire);
  } catch (err) {
    res.json({ message: err });
  }
});
// get in exam
questionRouter.get('/questions/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const questions = await Questionaire.find({ topic }).limit(20);
    res.json(questions);
  } catch (error) {
    console.error('Failed to fetch questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

questionRouter.delete('/question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Questionaire.findByIdAndDelete(id);
    
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Failed to delete question:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

questionRouter.put('/question/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question, options, correctAnswer, mark, createdAt, topic } = req.body;

    // Validate that the required fields are provided
    if (!question || !options || !correctAnswer || !mark || !createdAt || !topic) {
      return res.status(400).json({ error: 'All fields are required for question update' });
    }

    // Create an object with the updated question data
    const updatedQuestion = {
      question,
      options,
      correctAnswer,
      mark,
      createdAt,
      topic,
    };

    // Update the question using the findByIdAndUpdate method
    const updatedQuestionResult = await Questionaire.findByIdAndUpdate(id, updatedQuestion, { new: true });

    if (!updatedQuestionResult) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestionResult);
  } catch (error) {
    console.error('Failed to update question:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

module.exports = questionRouter;