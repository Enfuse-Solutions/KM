
import '../styles/Candidate.css'
import React, { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'



function Employee() {
  
  const { auth} = useAuth()
  const navigate = useNavigate();
  

  return (
    <div><button>Start Test</button></div>
  )
}

export default Employee