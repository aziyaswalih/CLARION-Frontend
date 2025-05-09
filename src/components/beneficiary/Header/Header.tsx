import React from 'react';
import { Button } from '../../ui/button';
import userAxiosInstance from '../../../api/useraxios';
import Swal from 'sweetalert2';
const Header: React.FC = () => {
  const authToken = localStorage.getItem('authToken'); // Check for token

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove token
    userAxiosInstance.post('/user/logout', {}, { withCredentials: true })
    // alert("Logout successful")
    Swal.fire({
      title: "Logout Successful",
      text: "You have been logged out successfully.",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    }).then(() => {
      window.location.href = '/'; 
    });

  };

  return (
    <header className="absolute top-0 left-0 w-full bg-transparent p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold font-serif text-[#774513]">CLARION</h1>
        <nav className="hidden md:flex space-x-6">
          <a href="/" className="text-[#3c3630] hover:text-[#b8860b] transition-colors">Home</a>
          <a href="/about_us" className="text-[#3c3630] hover:text-[#b8860b] transition-colors">About Us</a>
          <a href="/latest_causes" className="text-[#3c3630] hover:text-[#b8860b] transition-colors">Recent Causes</a>
          </nav>
        {authToken ? ( // Conditionally render button
          <Button variant="secondary" className="bg-[#b8860b] hover:bg-[#956d09] text-white" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="secondary" className="bg-[#b8860b] hover:bg-[#956d09] text-white" onClick={()=>{window.location.href = "/login"}}>
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;