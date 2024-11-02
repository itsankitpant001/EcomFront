import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = ()=>{
  const navigate=useNavigate()
  const id=window.localStorage.getItem('userId')
  const cart = useSelector((state) => state.cart.cart);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('userId');
    window.localStorage.removeItem('token');
    console.log("User logged out");
    navigate('/login')
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Menu Links */}
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="text-2xl font-semibold text-gray-800">
            <NavLink to="/">MyShop</NavLink>
          </div>
          {/* Menu Links */}
         {id? <NavLink 
            to="/" 
            className="px-4 py-2 text-gray-700 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
          >
            Home
          </NavLink>: ""}
         {id? <NavLink 
            to="/cart" 
            className="relative px-4 py-2 text-gray-700 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-300"
          >
            Cart ({cart.length})
          </NavLink>:""}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
        {!id?  <NavLink to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
            Login
          </NavLink>:""}
        {!id?  <NavLink to="/register" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-300">
            Sign Up
          </NavLink>:""}
        {id?  <button 
            onClick={handleLogout} 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>:""}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100">
          
          {!id?<NavLink to="/login" className="block px-4 py-2 text-sm text-gray-700">Login</NavLink>:""}
          {!id?<NavLink to="/login" className="block px-4 py-2 text-sm text-gray-700">Login</NavLink>:""}
         {id? <button 
            onClick={handleLogout} 
            className="block px-4 py-2 bg-red-500 text-white w-full text-left hover:bg-red-600 transition-colors duration-300"
          >
            Logout
          </button>:""}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
