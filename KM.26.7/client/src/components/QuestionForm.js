import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function QuestionForm({ onSubmit, getEndpointForTopic }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [mark, setMark] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionChange = (optionIndex) => {
    setCorrectAnswer(optionIndex);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Show confirm dialog
    Swal.fire({
      title: 'Submit Question?',
      text: 'Are you sure you want to submit this question?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Submit'
    }).then((result) => {
      if (result.isConfirmed) {
        // Check if the selected answer is correct
        const isAnswerCorrect = correctAnswer === options.indexOf(e.target.answer.value);

        // Assign the appropriate mark
        const newMark = isAnswerCorrect ? 1 : 0;
        setMark(newMark);

        // Create a new question object with the entered data
        const newQuestion = {
          question: question,
          options: options,
          correctAnswer: correctAnswer,
          mark: newMark,
          createdAt: new Date(),
        };

        // Send the question object to the parent component to store in the database
        const endpoint = getEndpointForTopic();
        axios
          .post(endpoint, newQuestion)
          .then(response => {
            console.log('Question saved successfully:', response.data);

            // Show success message with SweetAlert
            Swal.fire({
              title: 'Question Submitted!',
              text: 'Your question has been submitted successfully.',
              icon: 'success'
            });

            // Reset the form fields
            setQuestion('');
            setOptions(['', '', '', '']);
            setCorrectAnswer(0);
            setSubmitted(false);
            setMark(0);
          })
          .catch(error => {
            console.error('Error saving question:', error);
            // Show error message with SweetAlert
            Swal.fire({
              title: 'Error',
              text: 'There was an error submitting your question. Please try again later.',
              icon: 'error'
            });
          });

        // Set submitted state to true to indicate that the form has been submitted
        setSubmitted(true);
      }
    });
  };

  return (
    <div className="question-form">
      <form onSubmit={handleSubmit}>
        <label>
          Question:
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            placeholder="Set Question here"
          />
        </label>
        <br />
        {options.map((option, index) => (
          <label key={index}>
            <input
              type="radio"
              name="answer"
              value={option}
              checked={correctAnswer === index}
              onChange={() => handleOptionChange(index)}
              required
              disabled={submitted}
            />
            <input
              type="text"
              value={option}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index] = e.target.value;
                setOptions(newOptions);
              }}
              required
              disabled={submitted}
              placeholder="Add Options"
            />
          </label>
        ))}
        <br />
        {!submitted && <button type="submit" className='send-button'>Submit</button>}
      </form>
      {submitted && (
        <div>
          <p>Mark: {mark}</p>
        </div>
      )}
    </div>
  );
}

export default QuestionForm;
