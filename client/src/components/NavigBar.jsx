import React, { useState,useContext,useEffect } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import { UidContext } from "../AppContext";


const Navbar = () => {
  axios.defaults.withCredentials = true
  const [nav, setNav] = useState(false);
  const uid = useContext(UidContext);
  const navigate = useNavigate();
  const [auth,setAuth] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  console.log(uid)
  useEffect(() => {
    if (uid) setAuth(true);
  }, [uid]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogOut = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`).then(res => {
      if (res.data.valid) {
        setAuth(false)
        navigate("/")
        
      }
    }).catch(err => console.log(err))
  }


  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Home' },
    { id: 2, text: 'Company' },
    { id: 3, text: 'Resources' },
    { id: 4, text: 'About' },
    { id: 5, text: 'Contact' },
  ];

  return (
    <div className='bg-black flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 text-white'>
      {/* Logo */}
      <h1 className='w-full text-3xl font-bold text-[#00df9a]'>REACT.</h1>

      {/* Desktop Navigation */}
      <ul className='hidden md:flex'>
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 hover:bg-[#00df9a] rounded-xl m-2 cursor-pointer duration-300 hover:text-black'
          >
            {item.text}
          </li>
        ))}
        {auth ?
        <div
          className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
          >
       <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <FaUserCircle/>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => navigate("/admin")}>Admin </MenuItem>
        <MenuItem onClick={() => navigate("/vote")}>Voter</MenuItem>
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu> 
      
        </div> : <Button onClick={() => navigate("/login")}>Connexion</Button> }
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className='block md:hidden'>
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? 'fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
            : 'ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]'
        }
      >
        {/* Mobile Logo */}
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>REACT.</h1>

        {/* Mobile Navigation Items */}
        {navItems.map(item => (
          <li
            key={item.id}
            className='p-4 border-b rounded-xl hover:bg-[#00df9a] duration-300 hover:text-black cursor-pointer border-gray-600'
          >
            {item.text}
          </li>
        ))}
        
      </ul>
    </div>
  );
};

export default Navbar;