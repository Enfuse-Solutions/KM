import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useNavigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import logo from "../Assets/LnD Logo2.png"
import Swal from 'sweetalert2';

const FeedbackForm = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email:'',
    dateOfInduction: '',
    joiningDate: '',
    feedbackFor: '',
    presenter: '',
    question1: 0,
    question2: 0,
    question3: 0,
    question4: 0,
    comment: ''
  });
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const employeeId = auth._id;
  const presentersArray = ['Arjun Mehra', 'Anuja Gaikwad', 'Ashish Kurvelli', 'Bhavesh Bhatu', 'Danish Kably', 'Faizan Ansari', 'Feroz Sumara', 'Imran Ansari', 'Kamran Shaikh', 'Mahek Shaikh','Manish Kareya','Munazir Ansari','Parthiv Bhaskar','Reema Thakur','Ruhail Shaikh','Sadaf Khan','Sahil Shah','Salman Khan','Shahid Ansari','Sridhar Mogli','Suhail Syed','Sunil Saundalkar','Vaseem Ansari','Vedha Hiremath','Yusuf Khan','Zaynulabedin Mira','Zeeshan Dabir']
    // const presenterArray =const [userEmail, setUserEmail] = useState('');
    const [searchText, setSearchText] = useState('');
    const [autoSuggestData, setAutoSuggestData] = useState([]);
    const [isEmailSelected, setIsPresenterSelected] = useState(false);

    const searchEmails = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
        let searchText = e.target.value;
        setIsPresenterSelected(false);
        setSearchText(searchText);
        let emails = presentersArray.filter(presenter => {
            const regex = new RegExp(`^${searchText}`, 'gi');
            return presenter.match(regex)
        })
        setAutoSuggestData(emails)
    };

    const handleInputChange = (e) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [e.target.name]: e.target.value
        }));
    };

    const handleRatingChange = (question, newRating) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [question]: newRating
        }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
    
      // Send formData to the server and store it in the database
      fetch('http://localhost:8080/register/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Form data stored successfully:', data);
          Swal.fire({
            icon: 'success',
            title: 'Thanks for your Feedback',
            showConfirmButton: false,
            timer: 3000,
            confirmButtonText: 'OK'
          })
          setTimeout(()=>{
           
          navigate('/')
          }, 3000)
          
        })
        .catch((error) => {
          console.error('Error storing form data:', error);
          // Handle the error scenario appropriately
        });
    };

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };
    const clearForm = () => {
        setFormData({
          fullName: '',
          email: '',
          dateOfInduction: '',
          joiningDate: '',
          feedbackFor: '',
          presenter: '',
          question1: 0,
          question2: 0,
          question3: 0,
          question4: 0,
          question5: 0,
          question6: 0,
          comment: ''
        });
      };
  

  const prevPage = () => {
    setPage((prevPage) => prevPage - 1);
  };

  const renderPageOne = () => {
    return (
      <>
      <div className='fd-container '>
              <label className='fd-label' htmlFor="name">Name:</label>
              <br />
              <input
                  autoFocus
                  // className='width-50'
                  className='reg-inputs'
                  type="text"
                  id="name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
              />
              <br />
              <label className='fd-label' htmlFor="email">Email:</label>
              <br />
              <input
                  autoFocus
                  // className='width-50'
                  className='reg-inputs'
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
              />
              <br />

              <label className='fd-label' htmlFor="date-of-induction">Date Of Induction:</label>
              <br />
              <input
                  autoFocus
                  // className='width-50'
                  type="date"
                  className='reg-inputs-dd'
                  id="date-of-induction"
                  name="dateOfInduction"
                  value={formData.dateOfInduction}
                  onChange={handleInputChange}
              />
              <br />

              <label className='fd-label' htmlFor="joining-date">Joining Date:</label>
              <br />
              <input
                  autoFocus
                  // className='width-50'
                  type="date"
                  id="joining-date"
                  className='reg-inputs-dd'
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
              />
              <br />

              <label className='fd-label' htmlFor="feedback">Feedback being provided for:</label>
              <br />
              <select
                  className='reg-inputs'
                  name="feedbackFor"
                  id="feedback"

                  value={formData.feedbackFor}
                  onChange={handleInputChange}
              >
                  <option value="chooseone">Choose One</option>
                  <option value="hr">HR</option>
                  <option value="adobe">Adobe</option>
                  <option value="code-of-conduct">Code of Conduct</option>
                  <option value="data-management">Data Management</option>
                  <option value="dell">Dell</option>
                  <option value="digital-marketing">Digital Marketing</option>
                  <option value="exam-soft">Exam Soft/Proctor Exam</option>
                  <option value="information-security">Information Security</option>
                  <option value="values">Values</option> */
                  <option value="tagging">Tagging</option>
                  <option value="knowledge-management">Knowledge Management</option>
                  <option value="edtech">EdTech & Catalog Operations (ECO)</option>
                  <option value="support">Support Services HR</option>
                  <option value="business">Support Service Business Development</option>
                  <option value="data">Data & Digital (D&D)</option> */
              </select>
              <br />

              <label className='fd-label' htmlFor="presenter">Presenter:</label>
              <br />
          
              <input
                  autoFocus
                  className='reg-inputs'
                  // className='width-50'
                  type="text"
                  name="presenter"
                  id="presenter"
                  value={formData.presenter}
                  onChange={searchEmails}
              />
              <div className='next-button'>
                  {searchText.length > 0 && !isEmailSelected && Array.isArray(autoSuggestData) && autoSuggestData.map((el) => (
                      <span
                          onClick={() => {
                              setIsPresenterSelected(true)
                              // setUserEmail(el.email);
                              setFormData((prev) => ({ ...prev, presenter: el }))
                          }}
                          style={{
                              background: '#fff',
                              width: '185px',
                              height: '20px',
                              margin: '5px',
                              cursor: 'pointer'
                          }}
                      >
                          {el}
                      </span>
                  ))}
              </div >

              <br />

              <div className='fd-buttons'>
                  <button type="button" className='send-button' style={{float: 'left', margin: '0px 25px 25px 110px'}} onClick={nextPage}>
                      Next
                  </button>
                  <button type="button" className='send-button' style={{float: 'right', margin: '0px 115px 25px 25px'}} onClick={clearForm}>Clear Form</button>
              </div>
              </div>
      </>
    );
  };

  const renderPageTwo = () => {
    return (
      
      <>

       <div className='fd-container'>
       <h2>We'd Like to Here From you! </h2>
      <h3>Provide Your Rating <span>(1 Being the Lowest, 5 Being the Highest )</span></h3>
   <div className='fd-rating'>
     
        <div>
          <label>
            1. The facilitator was comprehensible/was easy to understand.
          </label>
          <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= formData.question1}
              onClick={() => handleRatingChange('question1', star)}
            />
          ))}
        </div>

        <div>
          
          <label>2. Was the facilitator friendly in his/her approach?</label>
          <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= formData.question2}
              onClick={() => handleRatingChange('question2', star)}
            />
          ))}
        </div>

        <div>
          
          <label>3. Was the content informative and helpful?</label>
          <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= formData.question3}
              onClick={() => handleRatingChange('question3', star)}
            />
          ))}
        </div>

        <div>
          
          <label>
            4. If there is anything that we can improve.
          </label>
          <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= formData.question4}
              onClick={() => handleRatingChange('question4', star)}
            />
          ))}
        </div>

        <div>
          
          <label>5. Was the  information Provide understandable ?</label>
          <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= formData.question5}
              onClick={() => handleRatingChange('question5', star)}
            />
          ))}
        </div>
        <div>
          
          <label>6. Was the Session Conducted in aProfessional Manner?</label>
          <br />
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={star <= formData.question6}
              onClick={() => handleRatingChange('question6', star)}
            />
          ))}
        </div>
          
        <div>
          <div>
            <label>7. Kindly leave a note in this comment section:</label>
          </div>
          <div>
            <textarea
              name="comment"
              placeholder="Write Your Comment Here"
              value={formData.comment}
              onChange={handleInputChange}
              cols={90} rows={3}
            />
        </div>
     </div>
      <div className='fd-buttons'>
      <button type="button" className='send-button' style={{float: 'left', margin: '5px 25px 25px 40px'}} onClick={prevPage}>
            Previous
          </button>
          <button type="submit" className='send-button' style={{float: 'right', margin: '5px 180px 25px 25px'}}>Submit</button>
          </div>


          </div>
        </div>
         
        
      

      </>
      
    );
  };

  return (
    <div>
      <div className='header-banner'>
        <img width='2%' src={logo} alt="" />
        <h1>FEEDBACK FORM</h1>
        
      </div>
      
      <form onSubmit={handleSubmit}>
        {page === 1 ? renderPageOne() : renderPageTwo()}
      </form>
    </div>
  );
};

const Star = ({ filled, onClick }) => {
  // const starIcon = filled ? fasStar : farStar; 
  const starColor = filled ? '#ffb800' : 'lightgrey';


  return (
    <span className="star" onClick={onClick}>
      {/* <FontAwesomeIcon icon={starIcon} /> */}
      <FontAwesomeIcon icon={fasStar} style={{ color: starColor }} />
    </span>
  );
};



export default FeedbackForm