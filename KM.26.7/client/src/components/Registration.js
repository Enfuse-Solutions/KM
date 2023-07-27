import { useState } from 'react';
import { emailData } from '../Assets/EmailData';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2'
import { managerData } from '../Assets/ManagerData';


function Registration() {

  const [formData, setFormData] = useState({
    category: '',
    firstName:'',
    lastName:'',
    email:'',
    topic:'',
    mgrName:'',
    mgrEmail:''
})
const [emailSuggestions, setEmailSuggestions] = useState([]);
const [managerSuggestions, setManagerSuggestions] = useState([]);
const navigate = useNavigate();
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevFormData) => ({
    ...prevFormData,
    [name]: value,
  }));

  if (name === 'category' && value !== 'Assessment') {
    setFormData((prevFormData) => ({
      ...prevFormData,
      topic: '', // Reset the topic selection if the category is changed to a non-Assessment value
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
};


  const validateForm = () => {
    let isValid = true;

    if (!formData.firstName) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Firstname',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.firstName)) {
      Swal.fire({
        title: 'Error!',
        text: 'Firstname should be of Alphabets without spaces & special Characters(!@#$%^,..)',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }

    if (!formData.lastName) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Last Name',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(formData.lastName)) {
      Swal.fire({
        title: 'Error!',
        text: 'Lastname should be of Alphabets without spaces & special Characters(!@#$%^,..)',
        icon: 'error',
        confirmButtonColor: '#00B4D2',
        confirmButtonText: 'OK'
      })
      isValid = false;
    }

    const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      Swal.fire({
        title: 'Error!',
        text: 'Enter Valid Email',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#00B4D2'
      })
      isValid = false;
    }
    return isValid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomNumber = Math.floor(Math.random() * 10000);
    const password = Math.random().toString(36).slice(-8);
    const createdAt = new Date();
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const username = formData.firstName+randomNumber
    const { category } = formData;

  const formDataWithFullName = {
    ...formData,
    fullName: fullName,
    username: username,
    password: password,
    confirmPassword: password,
    createdAt: createdAt,
    category: category,
    topics: [
      {
        topic: formData.topic
        
      }
    ]
    
  };
  const isValid = validateForm();
  if (isValid) {
      const response = await fetch('http://localhost:8080/register/employee', {
        method: 'POST',
        body: JSON.stringify(formDataWithFullName),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Registered successfully',
          showConfirmButton: false,
          timer: 3000,
          confirmButtonText: 'OK'
        })
        navigate('/admin')       
        setFormData({
          firstName: '',
          lastName: '',
          email:''
        
        });
        
        
      } else if (response.status === 409) {
        Swal.fire({
          icon: 'error',
          title: 'Email or Username already in use',
          showConfirmButton: false,
          confirmButtonColor: '#00B4D2',
          confirmButtonText: 'OK',
          timer: 3000
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          showConfirmButton: false,
          confirmButtonColor: '#00B4D2',
          timer: 3000
        })
      }
  }
  }


  return (
    
    <div className="reg-container">
    <h1 style={{fontSize: '25px', paddingBottom: ' 20px', fontWeight: 'bold', textDecoration:'underline' , textDecorationColor: '#00B4D2'}}> Register An Employee </h1>
    <form onSubmit={handleSubmit}>
    <label>First Name:</label>
    <input type="text" className="reg-input" name="firstName"  minLength={3} maxLength={20} value={formData.firstName} required onChange={handleChange} placeholder="Enter firstname"></input>
    <br />
    <label>Last Name:</label>
    <input type="text" className="reg-input" name="lastName"  minLength={3} maxLength={20} value={formData.lastName} required onChange={handleChange} placeholder="Enter lastname"></input>
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
<br />
<label>Category:</label>
<select name="category" className="reg-input" value={formData.category} onChange={handleChange}>
<option value="">Select Category</option>
<option value="Induction">Induction</option>
<option value="Assessment">Assessment</option>
<option value="SoftSkillsTraining">Soft Skills Training</option>
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
  {formData.category === 'SoftSkillsTraining' && (
  
    <select
    name="topic"
    value={formData.topic}
    required
    onChange={handleChange}
    className="reg-input"
    >
    <option value="">Select Topic</option>
    <option value="Information Security">Information Security</option>
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
    <button
      className='send-button'
      type="submit"
      style={{marginLeft: '80px'}}
    >
      Submit
    </button>
  
    </form>
    </div>
  )
}

export default Registration;