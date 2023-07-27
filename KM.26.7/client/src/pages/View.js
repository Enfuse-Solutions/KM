import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/View.css';
import { FadeLoader } from 'react-spinners';
import { Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';

function View() {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();

  const Star = ({ filled, onClick }) => {
    const starColor = filled ? '#ffb800' : 'lightgrey';
    return (
      <span className="star" onClick={onClick}>
        <FontAwesomeIcon icon={fasStar} style={{ color: starColor }} />
      </span>
    );
  };

  const handleScoreReset = async (rowKey) => {
    const topicToUpdate = assessmentData.find((topic) => topic.key === rowKey);
    if (topicToUpdate) {
      try {
        const response = await axios.put(
          `http://localhost:8080/employee/${id}/resetScore`,
          {
            topicId: topicToUpdate.topicId,
            newScore: -1,
          }
        );

        if (response.status === 200) {
          // Update the state immediately after successful update in the backend
          setEmployee((prevEmployee) => {
            const updatedTopics = prevEmployee.topics.map((topic) =>
              topic.key === rowKey ? { ...topic, score: -1 } : topic
            );
            return { ...prevEmployee, topics: updatedTopics };
          });

          // Optionally, store the updated employee object in localStorage
          localStorage.setItem('employeeData', JSON.stringify(employee));
        } else {
          // Handle the error if the API call is not successful
          console.error('Failed to update score in the backend');
        }
      } catch (error) {
        console.error('Error resetting score:', error);
      }
    }
  };

  // Fetch employee data and handle score reset on component mount and when assessmentData changes
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:8080/employee/${id}`);
        const data = await response.json();
        if (response.ok) {
          setEmployee(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };
    fetchEmployee();
  }, [id]);

  

  const handleRedirect = () => {
    if (employee.category === 'Assessment') {
      navigate('/admin');
    } else if (employee.category === 'Induction') {
      navigate('/induction');
    }
  };

  if (!employee) {
    return (
      <div style={{ margin: "250px auto" }}>
        <center>
          <FadeLoader color={"#00B4D2"} size={20} margin={2} />
        </center>
      </div>
    );
  }

  const assessmentData = employee.topics
  ? employee.topics.map((topic, index) => ({
      key: index,
      topic: topic.topic,
      score: topic.score === -1 ? 0 : topic.score,
      testCount: topic.testCount,
      topicId: topic._id,
    }))
  : [];

  // Function to handle score reset
  
  if (employee.category === 'Assessment') {
    const columns = [
      {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic',
      },
      {
        title: 'Score',
        dataIndex: 'score',
        key: 'score',
      },
      {
        title: 'Test Taken',
        dataIndex: 'testCount',
        key: 'testCount',
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <button onClick={() => handleScoreReset(record.key)}>Reset Score</button>
        ),
      },
    ];

    return (
      <div>
        <div className='table-container'>
          <h1 style={{ color: '#28325A', textTransform: "capitalize" , fontWeight: "bold"}}>Assessment - {employee.fullName}</h1>
          <br />
          <p style={{textTransform: "capitalize"}}><span style={{fontWeight: "bold"}}>First Name:</span> {employee.firstName}</p>
          <p style={{textTransform: "capitalize"}}><span style={{fontWeight: "bold"}}>Last Name:</span> {employee.lastName}</p>
          <p><span style={{fontWeight: "bold"}}>Email:</span> {employee.email}</p>
          <p><span style={{fontWeight: "bold"}}>Password:</span> {employee.confirmPassword}</p>
          <br />
          <hr />
          <h3 style={{fontWeight: "bold"}}>Test Results:</h3>
    
          <Table
            dataSource={assessmentData}
            columns={columns}
            pagination={false}
          />
          <hr />
          <h2 style={{ color: 'Green', fontSize: '18px' }}>Status: {employee.status || "In Progress"}</h2>
        </div>

        <div className='back-button-container'>
          <button className='submit-button' onClick={handleRedirect} type="submit">BACK</button>
        </div>
      </div>
    );
  } else if (employee.category === 'Induction') {
    const columns = [
      {
        title: 'Joining Date',
        dataIndex: 'joiningDate',
        key: 'joiningDate',
      },
      {
        title: 'Induction Date',
        dataIndex: 'inductionDate',
        key: 'inductionDate',
      },
      {
        title: 'Department',
        dataIndex: 'feedbackFor',
        key: 'feedbackFor',
      },
      {
        title: 'Presenter',
        dataIndex: 'presenter',
        key: 'presenter',
      }
    ];

    return (
      <div className='card-edit'>
        <div className='card-edit-image-info'>
          <h1 style={{ color: '#28325A' }}>{employee.fullName}</h1>
          <br />
          <p><b>First Name:</b> {employee.firstName}</p>
          <p><b>Last Name:</b> {employee.lastName}</p>
          <p><b>Email:</b> {employee.email}</p>
          <h3>Induction Details:</h3>
          <Table dataSource={employee ? [employee] : []} columns={columns} pagination={false} />
          <p>1. The facilitator was comprehensible/was easy to understand :  {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= employee.question1}
            />
          ))}</p><br/>
          <p>2. Was the facilitator friendly in his/her approach? :  {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= employee.question2}
              
            />
          ))}</p><br/>
          <p>3. Was the content informative and helpful? :  {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= employee.question3}
              
            />
          ))}</p><br/>
          <p>4. If there is anything that we can improve :  {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= employee.question4}
              
            />
          ))}</p><br/>
          <p>5. Was the  information Provide understandable ? :  {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= employee.question5}
              
            />
          ))}</p><br/>
          <p>6. Was the Session Conducted in aProfessional Manner? :  {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= employee.question6}
              
            />
          ))}</p><br/>
          <p>Comment: {employee.comment}</p>
        </div>

        <div className='back-button-container'>
          <button className='submit-button' onClick={handleRedirect} type="submit">BACK</button>
        </div>
      </div>
    );
  } else {
    return null; // Handle other categories if necessary
  }
}

export default View;
