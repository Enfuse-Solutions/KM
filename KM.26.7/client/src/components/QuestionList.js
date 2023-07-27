import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function QuestionList() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchQuestions = async () => {
    try {
      const endpoint = `http://localhost:8080/questions/${selectedCategory}`;
      const response = await axios.get(endpoint);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchQuestions();
    }
  }, [selectedCategory]);

  const handleDeleteQuestion = async (id) => {
    console.log("Question ID to delete:", id);
  
    try {
      await axios.delete(`http://localhost:8080/question/${id}`);
      // After successful deletion, refetch the questions to update the list
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleEditQuestion = (id) => {
    navigate('/question/edit/' + id)
  }

 

  return (
    <div className="question-list">

      <div className="question-list__category">
        <label htmlFor="category" className="question-list__label">Select Category:</label>
        <select
          id="category"
          className="question-list__select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select</option>
          <option value="HR">HR</option>
          <option value="informationSecurity">Information Security</option>
          <option value="codeOfConduct">Code Of Conduct</option>
          <option value="emailEtiquette">Email Etiquette</option>
          <option value="telephoneEtiquette">Telephone Etiquette</option>
          <option value="corporateEtiquette">Corporate Etiquette</option>
          <option value="feedback">Feedback</option>
          <option value="values">Values</option>
          <option value="acknowledgementEmpathy">Acknowledgement & Empathy</option>
          <option value="unconsciousBias">Unconscious Bias</option>
          <option value="grammarPunctuation">Grammar & Punctuation</option>
          <option value="responseReaction">Response Vs Reaction</option>
          <option value="confidenceHacks">Confidence Hacks</option>
          <option value="others">Others</option>
        </select>
      </div>
      <ol className="question-list__items">
        {questions.map(question => (
          <li key={question._id} className="question-list__item">
            <h3 className="question-list__question">{question.question}</h3>
            <p className="question-list__options">Options: {question.options.join(', ')}</p>
            <p className="question-list__correct-answer">Correct Answer: {question.options[question.correctAnswer]}</p>
            <p className="question-list__submitted-date">Submitted Date: {new Date(question.createdAt).toLocaleString()}</p>
             {/* Edit button */}
             <button
             onClick={() => handleEditQuestion(question._id)}
             className="question-list__edit-btn"
           >
             Edit
           </button>

           {/* Delete button */}
           <button onClick={() => handleDeleteQuestion(question._id)} className="question-list__delete-btn">
           Delete
         </button>
            </li>
        ))}
      </ol>
    </div>
  );
}

export default QuestionList;
