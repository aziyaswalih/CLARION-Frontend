import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin/login'); // Redirect to home page using useNavigate
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null; // Component doesn't need to render anything visible
};

export default Logout;