import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTh, FaAdn, FaRegUser } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { VscFeedback } from 'react-icons/vsc';
import { GrCircleQuestion } from 'react-icons/gr';
import useAuth from '../hooks/useAuth';
import '../styles/Sidebar.css';
import logo from '../Assets/enfuse-logo.png';
import Swal from 'sweetalert2';

const Sidebar = ({ children }) => {
  const navigate = useNavigate();
  const [isOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const { auth, setAuth } = useAuth();
  const logout = () => {
    setAuth({});
    navigate('/');
    Swal.fire('Logged out!', 'You have successfully logged out.', 'success');

    console.log('Logged out');
  };

  const menuItem = [
    {
      path: '/admin',
      name: 'Admin',
      icon: <FaAdn />,
    },
    {
      path: '/induction',
      name: 'Induction',
      icon: <VscFeedback />,
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: <FaTh />,
    },
    {
      path: '/questionaire',
      name: 'Questions',
      icon: <GrCircleQuestion />,
    },
    {
      path: '/exam',
      name: 'Exam',
      icon: <FaRegUser />,
    },
  ];

  if (auth.role === 'Employee') {
    return <main>{children}</main>;
  }

  return (
    <div>
      <div className="container">
        {auth.role && (
          <div style={{ width: isOpen ? '150px' : '25px' }} className="sidebar">
            <div className="top-section">
              <img style={{ width: '80%' }} src={logo} alt="logo" />
              <br />
              <p style={{ fontWeight: 'bold' }}>
                Welcome
                <br />
                {auth.fullName}
                <br />
                {auth.currentLocation}
                <br /> {auth.contact}
                <br /> {auth.appliedPosition}
              </p>
            </div>

            {menuItem.map((item, index) => {
              if (auth.role === 'Admin') {
                return (
                  (item.name === 'Admin' ||
                    item.name === 'Reports' ||
                    item.name === 'Questions' ||
                    item.name === 'Induction') && (
                    <NavLink to={item.path} key={index} className="link" activeclassname="active">
                      <div className="icon">{item.icon}</div>
                      <div className="link-text">{item.name}</div>
                    </NavLink>
                  )
                );
              } else {
                return null;
              }
            })}

            {auth.role && (
              <button className="icon-button" onClick={logout}>
                <span className="icon-container">
                  <MdLogout />
                </span>{' '}
                <span className="text">Logout</span>
              </button>
            )}
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
