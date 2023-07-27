import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { emailData } from '../Assets/EmailData';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { managerData } from '../Assets/ManagerData';


function Edit() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    firstName: '',
    lastName: '',
    email: '',
    topics: [],
  });

  const [employee, setEmployee] = useState({});
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [managerSuggestions, setManagerSuggestions] = useState([]);
  const { id } = useParams();

  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:8080/employee/${id}`);
        const data = await response.json();
        if (response.ok) {
          setEmployee(data.data);
          setFormData(data.data);
          setCategory(data.data.category); // Set the category value from the fetched data
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

  const validateForm = () => {
    let isValid = true;
    // Validation logic here...
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: selectedOptions,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    if (name === 'category' && value !== 'Assessment') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        topics: [], // Reset the topics selection if the category is changed to a non-Assessment value
      }));
    }
    if (name === 'email') {
      const filteredEmails = emailData
        .map((item) => item.email)
        .filter((email) => email.toLowerCase().startsWith(value.toLowerCase()));
      setEmailSuggestions(filteredEmails);
    }

    if (name === 'mgrName') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        mgrEmail: managerData.find((item) => item.mgrName === value)?.mgrEmail || '',
      }));
  
      const filteredManagerNames = managerData
        .map((item) => item.mgrName)
        .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()));
  
      setManagerSuggestions(filteredManagerNames);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    if (name === 'category') {
      if (value === 'Assessment') {
        // If the category is changed to Assessment, remove the topic for Induction
        setFormData((prevFormData) => ({
          ...prevFormData,
          topics: [],
        }));
      } else if (value === 'Induction') {
        // If the category is changed to Induction, remove the topic for Assessment
        setFormData((prevFormData) => ({
          ...prevFormData,
          topics: [],
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { topic, category } = formData;
    const isValid = validateForm();
    const createdAt = new Date();
    
    const password = Math.random().toString(36).slice(-8);

  
    if (isValid) {
      const fullName = `${formData.firstName} ${formData.lastName}`;
  
      // Find the last index of a topic in the topics array
      const lastIndex = formData.topics ? formData.topics.length : 0;
      const newTopic = {
        topic: formData.topic,
        score: -1, // Initialize score as 0 for the new topic
      };
  
      // If the topics array is empty or the next available index is already occupied,
      // push the new topic to the end of the array
      if (!formData.topics || lastIndex === formData.topics.length) {
        formData.topics.push(newTopic);
      } else {
        // If the next available index is empty, set the new topic at that index
        formData.topics[lastIndex] = newTopic;
      }
  
      const formDataWithFullName = {
        ...formData,
        fullName: fullName,
        createdAt: createdAt,
        category: category,
        password: password,
        confirmPassword: password
      };
  
      try {
        const result = await axios.put(`http://localhost:8080/employee/${id}`, formDataWithFullName);
        if (formData.category === 'Assessment') {
          navigate('/admin');
        } else if (formData.category === 'Induction') {
          navigate('/induction');
        }
        console.log(result.data);   
      } catch (error) {
        console.error(error);
      }


    }
  };
  return (
    <div className="reg-container">
      <h1 style={{ fontSize: '25px', paddingBottom: ' 20px', fontWeight: 'bold', textDecoration: 'underline', textDecorationColor: '#00B4D2' }}>
        Update an Employee
      </h1>

      {formData.fullName}

      <form onSubmit={handleSubmit}>
        <label>First Name:</label>
        <input
          type="text"
          className="reg-input"
          name="firstName"
          minLength={3}
          maxLength={20}
          value={formData.firstName}
          required
          onChange={handleChange}
          placeholder="Enter firstname"
        />
        <br />
        <label>Last Name:</label>
        <input
          type="text"
          className="reg-input"
          name="lastName"
          minLength={3}
          maxLength={20}
          value={formData.lastName}
          required
          onChange={handleChange}
          placeholder="Enter lastname"
        />
        <br />
        <label>Email:</label>
        <input
          className="reg-input"
          type="text"
          name="email"
          value={formData.email}
          maxLength={50}
          required
          onChange={handleChange}
          placeholder="Enter valid Mail Id"
          list="emailSuggestions"
        />
        <datalist id="emailSuggestions">
          {emailSuggestions.map((email, index) => (
            <option key={index} value={email} />
          ))}
        </datalist>
        <br />
        <label>Category:</label>
<select name="category" className="reg-input" value={formData.category} onChange={handleChange}>
<option value="">Select Category</option>
<option value="Induction">Induction</option>
<option value="Assessment">Assessment</option>
</select>
{formData.category === 'Assessment' && (
  
<select
name="topic"
value={formData.topic}
required
onChange={handleChange}
className="reg-input"
>
<option value="">Select Topic</option>
<option value="HR">HR</option>
<option value="Information Security">Information Security</option>
<option value="Code Of Conduct">Code Of Conduct</option>
<option value="Email Etiquette">Email Etiquette</option>
<option value="Telephone Etiquette">Telephone Etiquette</option>
<option value="Corporate Etiquette">Corporate Etiquette</option>
<option value="Feedback">Feedback</option>
<option value="Values">Values</option>
<option value="Acknowledgement & Empathy">Acknowledgement & Empathy</option>
<option value="Unconscious Bias">Unconscious Bias</option>
<option value="Grammar & Punctuation">Grammar & Punctuation</option>
<option value="Response vs Reaction">Response Vs Reaction</option>
<option value="Confidence Hacks">Confidence Hacks</option>
<option value="Others">Others</option>



</select>
)}

{formData.category === 'Induction' && (
  <select
  name="topic"
  value={formData.topic}
  required
  onChange={handleChange}
  className="reg-input"
  >
  <option value="">Select Topic</option>
  <option value="HR">HR</option>
  <option value="Code Of Conduct">Code Of Conduct</option>
  <option value="Information Security">Information Security</option>
  <option value="Digital Marketing">Digital Marketing</option>
  <option value="Values">Values</option>
  <option value="Learning & Developement">Learning & Development</option>
  <option value="Dell">Dell</option>
  <option value="Proctoring">Proctoring</option>
  <option value="Adobe">Adobe</option>
  <option value="Tagging">Tagging</option>
  <option value="EDM">EDM</option>
  <option value="SEO">SEO</option>
  <option value="Others">Others</option>
  </select>
  )}
  <br />
  <label>Manager Name:</label>
  <input
    type="text"
    className="reg-input"
    name="mgrName"
    minLength={3}
    maxLength={20}
    value={formData.mgrName}
    required
    onChange={handleChange}
    placeholder="Enter Manager Name"
    list="managerSuggestions"
  />
  <datalist id="managerSuggestions">
    {managerSuggestions.map((name, index) => (
      <option key={index} value={name} />
    ))}
  </datalist>
  <br />
  <label>Manager Email:</label>
  <input
    type="text"
    className="reg-input"
    name="mgrEmail"
    value={formData.mgrEmail}
    maxLength={50}
    required
    onChange={handleChange}
    placeholder="Manager Email will be autofilled"
    disabled // Disable the input to prevent manual editing of the email
  />
  <br />
  
        
        <br />
        <div className='back-button-container'>
        <button className="send-button" type="submit" style={{ marginLeft: '80px' }}>
          Update
        </button>
        <button className='send-button' onClick={handleRedirect} type="submit">BACK</button>
        </div>
      </form>

      
    </div>
  );
}

export default Edit;