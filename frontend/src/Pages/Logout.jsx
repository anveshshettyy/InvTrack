import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:3000/logout', {}, { withCredentials: true })
      .then(response => {
        console.log(response.data.message);
        navigate('/signin'); 
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  }, [navigate]); 

  
  return null; 
}

export default Logout;
