import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Exam.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Exam = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const passingScore = 0.9 * questions.length;
  const pendingTopics = auth.topics.filter((topic) => topic.score === -1);
  
   const fetchQuestions = async () => {
    try {
      const currentTopic = auth.topics[currentTopicIndex];
      if (currentTopic.score !== -1) {
        // If the score is not -1, the exam for this topic has already been attempted
        setQuestions([]);
        console.log('Exam already attempted for this topic');
      } else {
        const endpoint = getEndpointForTopic();
        const response = await axios.get(endpoint);
        setQuestions(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };



  useEffect(() => {
    if (auth.role === 'Employee') {
      // Find the index of the first topic with a score of -1 (not attempted)
      const firstNotAttemptedTopicIndex = auth.topics.findIndex((topic) => topic.score === -1);
  
      // Set the currentTopicIndex to the firstNotAttemptedTopicIndex
      if (firstNotAttemptedTopicIndex !== -1) {
        setCurrentTopicIndex(firstNotAttemptedTopicIndex);
      } else {
        // If all topics are attempted, set the currentTopicIndex to the last topic
        setCurrentTopicIndex(auth.topics.length - 1);
      }
  
      try {
        fetchQuestions();
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    }
  }, [auth.role, auth.topics, currentTopicIndex]);
  
  
  const getEndpointForTopic = () => {
    
    console.log('currentTopicIndex:', currentTopicIndex);
    const userTopic = auth.topics[currentTopicIndex]?.topic;
    console.log('userTopic:', userTopic);
    if (userTopic) {
      switch (userTopic) {
        case 'HR':
          return 'http://localhost:8080/questions/HR';
        case 'Email Etiquette':
          return 'http://localhost:8080/questions/emailEtiquette';
        case 'Telephone Etiquette':
          return 'http://localhost:8080/questions/telephoneEtiquette';
        case 'Corporate Etiquette':
          return 'http://localhost:8080/questions/corporateEtiquette';
        case 'Code Of Conduct':
          return 'http://localhost:8080/questions/codeOfConduct';
        case 'Feedback':
          return 'http://localhost:8080/questions/feedback';
        case 'Acknowledgement & Empathy':
          return 'http://localhost:8080/questions/acknowledgementEmpathy';
        case 'Values':
          return 'http://localhost:8080/questions/values';
        case 'Unconscious Bias':
          return 'http://localhost:8080/questions/unconsciousBias';
        case 'Grammar & Punctuation':
          return 'http://localhost:8080/questions/grammarPunctuation';
        case 'Response vs Reaction':
          return 'http://localhost:8080/questions/responseReaction';
        case 'Confidence Hacks':
          return 'http://localhost:8080/questions/confidenceHacks';
        case 'Others':
          return 'http://localhost:8080/questions/others';
        default:
          throw new Error(`Invalid topic: ${userTopic}`);
      }
    } else {
      throw new Error('No topic found for the user.');
    }
  };
  
 const renderResult = () => {
  if (score !== null) {
    // Consider passing if the user scores 90% or above
    const hasPassed = score >= passingScore;

    return (
      <div>
        <center>
          <h2 style={{ fontWeight: 'bold', color: hasPassed ? 'green' : 'red' }}>
            You have {hasPassed ? 'passed' : 'failed'} the exam.
          </h2>
        </center>
      </div>
    );
  }
  return null; // Don't display anything if the user has not completed the exam yet
};



  const updateScore = async () => {
    try {
      if (!questions || questions.length === 0) {
        throw new Error('No questions found.');
      }
      const currentTopic = auth.topics[currentTopicIndex].topic;
      const passingScore = 0.9 * questions.length; // Consider passing if the user scores 90% or above
      let totalScore = 0;
      
      for (let i = 0; i < questions.length; i++) {
        const correctAnswerIndex = questions[i].correctAnswer;
        const userAnswer = userAnswers[i];
  
        if (userAnswer !== undefined && correctAnswerIndex === parseInt(userAnswer)) {
          totalScore++;
        }
      }
  
      setScore(totalScore); // Update the score state with the total score
      await sendEmailToEmployee(auth.fullName, auth.email, currentTopic, totalScore);
      // Update the score for the specific topic attempted by the user
      const userTopic = auth.topics[currentTopicIndex]?.topic; // Use currentTopicIndex to get the topic
      if (userTopic) {
        const topicObj = auth.topics.find((topic) => topic.topic === userTopic);
        const topicId = topicObj._id;
        const endpoint = `http://localhost:8080/employees/${auth._id}/topics/${topicId}`;
        console.log('Endpoint:', endpoint); // Log the endpoint URL
        console.log('Score to update:', totalScore); // Log the score value
        await axios.put(endpoint, { score: totalScore });
      }
      setCurrentTopicIndex((prevIndex) => prevIndex + 1);
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  const sendEmailToEmployee = async (fullName, email, topic, score) => {
    try {
      const result = score >= passingScore ? 'Passed' : 'Failed';

      const response = await axios.post("http://localhost:8080/score/employee", {
        fullName,
        email,
        topic,
        score,
        result,
      });

      console.log('Email sent to employee successfully:', response.data);
    } catch (error) {
      console.error('Failed to send email to employee:', error);
    }
  };
  

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleAnswerChange = (event) => {
    const { name, value } = event.target;
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value === 'null' ? null : parseInt(value),
    }));
  };

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const correctAnswerIndex = questions[i].correctAnswer;
      const userAnswer = userAnswers[i];
      if (userAnswer !== undefined && correctAnswerIndex === parseInt(userAnswer)) {
        score++;
      }
    }
    setScore(score);
    setCurrentQuestionIndex(questions.length);
    updateScore();
     // Update the score using PUT request
  };

  const handleLogout = async () => {
    try {
      // Extract necessary datak   
      
      const currentTopic = auth.topics[currentTopicIndex].topic;
      const score = updateScore(); // Implement the function to calculate the user's score
      
  
      // Send email with exam details before logging out
      await sendEmailToManager(auth.fullName, auth.mgrEmail, auth.mgrName, currentTopic, score);
      // Clear the authentication data and navigate to the home page
      setAuth({});
      navigate('/'); // Make sure this navigates to the appropriate route
  
      console.log('Logged out');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  const sendEmailToManager = async (fullName, mgrEmail,mgrName, topic, score) => {
    try {
      const result = score >= passingScore ? 'Passed' : 'Failed';

      const response = await axios.post("http://localhost:8080/score/manager", {
        fullName,
        mgrEmail,
        mgrName,
        topic,
        score,
        result,
      });

      console.log('Email sent to manager successfully:', response.data);
    } catch (error) {
      console.error('Failed to send email to manager:', error);
    }
  };
  const renderSubmittedAnswers = () => {
    
    return questions.map((question, index) => {
      const correctAnswerIndex = question.correctAnswer;
      const correctAnswer = question.options[correctAnswerIndex];
      const userAnswer = userAnswers[index];
      const isAnswered = userAnswer !== undefined;
  
      return (
        <div>
        <div key={index} >
          <h3 >
            <b  style={{fontWeight:'bold'}}>Question {index + 1}:</b> {question.question}
          </h3>
          <p style={{ color: isAnswered && userAnswer === correctAnswerIndex ? 'green' : 'red' , margin: '10px',  }}>
            <b style={{fontWeight:'bold'}}>Correct Answer:</b> {question.options[correctAnswerIndex]}
          </p>
          <p>
            <b style={{fontWeight:'bold', margin: '10px'}}>Your Answer:</b> {isAnswered ? (userAnswer === null ? 'Not answered' : question.options[userAnswer]) : 'Not answered'}
          </p>
          <hr/>
        </div>
        </div>
      );
    });
  };
  
  return (
    <div className='quiz-container'>
    {pendingTopics.length === 0 ? (
      <div>
        <center>
          <h2>No assessments pending.</h2>
          <p>Please Close this Window</p>
        </center>
      </div>
    ) : currentQuestionIndex < questions.length ? (
        <div>
        <div className='que-container'>
          <h2>{currentQuestionIndex + 1}.{questions[currentQuestionIndex].question}</h2>
          </div>
          <div>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <div key={index} className='ans-options'>
              <input
                type="radio"
                id={`option${index}`}
                name={currentQuestionIndex.toString()} // Convert to string
                value={index === questions[currentQuestionIndex].options.length ? "null" : index.toString()} // Convert to string, handle "Not answered" option
                checked={userAnswers[currentQuestionIndex] === (index === questions[currentQuestionIndex].options.length ? null : index)} // Compare with null for "Not answered" option
                onChange={handleAnswerChange}
              />
              <label className='options' htmlFor={`option${index}`}>{option}</label>
            </div>
          ))}
          
          </div>
          <div>
            <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button className='send-button' onClick={calculateScore}>Finish</button>
            ) : (
              <button className='send-button' onClick={handleNext}>Next</button>
            )}
          </div>
        </div>
      ) : (
        <div>
        {renderResult()}
          <center>
          <h2 style={{fontWeight: 'bold'}}>You scored {score} out of {questions.length}.</h2>
          <p style={{fontWeight: 'bold'}}>Here are the Correct Answers & Your submitted Answers</p></center>
          <br />
          <div className='result-container'>
          {renderSubmittedAnswers()}
          </div>
          <center><button onClick={handleLogout} className='send-button'>
          Submit & Logout
        </button></center>
        </div>
      )}
  
    </div>
      
  )}
export default Exam
