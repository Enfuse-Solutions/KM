import { React, useState } from 'react'
import '../styles/Login.css';
import useAuth from "../hooks/useAuth";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import login from '../Assets/Hire bg.jpg'
import Swal from 'sweetalert2';


function Home() {
  const { auth } = useAuth();
  const { setAuth } = useAuth();

  let navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const onLogin = async () => {
    const credentials = {
      email,
      password,

    };
    const baseURL = "http://localhost:8080/api/login"

    axios.post(baseURL, credentials).then((response) => {

      if (response.status === 200) {
        console.log("response data is:", response.data)

        if (response.data.role === "Admin") {
          navigate("/admin");
        } else if (response.data.role === "Employee") {
           if (response.data.category === "Induction"){
            navigate("/feedback");
           } else {
            navigate('/exam')
           }
          const authData = response.data;
          const selectedTopic = authData.topics[0].topic; // Access the first topic in the topics array
          console.log("Selected topic:", selectedTopic);
          setAuth(authData);
          

        }
      }
      else { console.warn("check the response") }
      setAuth(response.data)
      console.log("response:", response)
      
    })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 400) {
            Swal.fire({
              title: 'Error!',
              text: 'Enter username and password',
              icon: 'error'
            })
          } else if (error.response.status === 404) {
            Swal.fire({
              title: 'Error!',
              text: 'Invalid username',
              icon: 'error'
            })
          } 
          else if (error.response.status === 401) {
            Swal.fire({
              title: 'Error!',
              text: 'Incorrect Password',
              icon: 'error'
            })}
          }

       
      });
    navigate(from, { replace: true });
  }


  return (
    <div>


      {auth.role ?
        <h1> Welcome to {auth.role} Dashboard</h1>
        : <div className='logincontainer'>
            <center>
                <div className='column2'>
                  <form>
                    <div className='form-container'>
                      <div className='column1'>
                          <img src={login} alt="login" />
                      </div>
                      <div className='column3'>
                          <h1>User Login</h1>
                          <input type="text" className="login-field1"
                            placeholder="Username"
                            onChange={(e) => setEmail(e.target.value)} />
                          <input type="password" className="login-field1" placeholder="Password" onChange={(e) => { setPassword(e.target.value); }} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              onLogin();
                            }
                          }}/>
                          <div className='login-butt-cont'>
                              <button className="submit-button1" type="button" onClick={onLogin}>LOGIN</button>
                          </div>
                      </div>
                    </div>
                  </form >
                </div>
          </center>
        </div>}


    </div>
  )
}

export default Home
