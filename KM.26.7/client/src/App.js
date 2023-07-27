import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import Sidebar from './components/Sidebar';
import RequireAuth from './components/RequireAuth';
import { AuthProvider } from './context/AuthProvider';

//import Profile from './pages/Profile.js';

import Candidate from './pages/Candidate'; 
import Home from './pages/Home.js';
import Reports from './pages/Reports.js';

import './App.css'
//import Thankyou from './pages/Thankyou';
import { FadeLoader } from "react-spinners";


import QuestionList from './components/QuestionList';
import Exam from './pages/Exam';
import Questionaire from './pages/Questionaire';
import Admin from './pages/Admin';
import FeedbackForm from './pages/FeedbackForm';
import View from './pages/View';
import Edit from './pages/Edit';
import Induction from './pages/Induction';
import Registration from './components/Registration';
import QuestionForm from './components/QuestionForm';


const App = () => {
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
      setIsLoading(true); 
  }, []);

  if (!isLoading) {
    return <div style={{ textAlign: 'center', margin: '200px auto' }}>
    <center><FadeLoader color={'#00B4D2'} size={20} /></center>
    <div>Please wait a moment</div>
  </div>
  }
  return (
    <BrowserRouter>
      <AuthProvider>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route element={<RequireAuth />} >
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path='register' element={<Registration />} />
           <Route path='/admin' element={<Admin />} />
           <Route path='/induction' element={<Induction />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/candidate/candidate" element={<Candidate />} />
            <Route path='/questionaire' element={<Questionaire />} />
            <Route path='/questions/all' element={<QuestionList />} />
            <Route path='/exam' element={<Exam />} />
            <Route path='/hr/view/:id' element={<View />}/>
            <Route path='/hr/edit/:id' element={<Edit />}/>
            <Route path='/question/edit/:id' element={<QuestionForm />} />
          </Route>
        </Routes>
      </Sidebar>
        </AuthProvider>
    </BrowserRouter>
  );
};

export default App