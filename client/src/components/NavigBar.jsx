import React, { useState,useContext,useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { UidContext } from "../AppContext";
import Swal from 'sweetalert2'


const Navbar = () => {
  axios.defaults.withCredentials = true
  const [nav, setNav] = useState(false);
  const uid = useContext(UidContext);
  const navigate = useNavigate();
  const location = useLocation();
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
  // Admin pannel
  const connectToAdmin = async () => {
    if (location.pathname !== "/admin"){
      navigate("/admin")
    //   if (localStorage.getItem("admin")) {
    //     navigate("/admin")
    //   } else {
    //   const { value: password } = await Swal.fire({
    //   title: "Entrez votre Mot de passe admin",
    //   input: "password",
    //   color : "#fff",
    //   inputPlaceholder: "****************",
    //   background:"#33322e",
    //   inputAttributes: {
    //     autocapitalize: "off",
    //     autocorrect: "off"
    //   }
    //   })
    // if (password) {
    //   if (password === process.env.REACT_APP_PASSWORD_ADMIN){
    //     localStorage.setItem("admin",true)
    //     navigate("/admin")
    //   } else {
    //     Swal.fire({
    //       icon: "error",
    //       color : "#fff",
    //       background:"#33322e",
    //       title: "Mauvais mot de passe ! ",
    //       text: "Veuillez Reessayer",
    //     });
    //   }
    // }}
  }
  }
  const handleLogOut = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`).then(res => {
      if (res.data.valid) {
        setAuth(false)
        localStorage.removeItem('admin');
        navigate("/")
        window.location.reload()
      }
    }).catch(err => console.log(err))
  }

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items
  const navItems = [
    { id: 1, text: 'Accueil' },
    { id: 2, text: 'Comment ça marche ?' },
  ];

  return (
    <div className='bg-zinc-950 flex justify-between items-center h-24 w-full px-4 text-white'>
      {/* Logo */}
      <Link to="/" className="flex items-center ml-5">
        <img src={`${process.env.PUBLIC_URL}/VoteLogo.jpg`} alt="Logo" className="h-20 mr-5 rounded-full" />
      </Link>

      {/* Desktop Navigation */}
      <ul className='flex'>
          <li className='p-4' >
            <Link to="/" className='p-4 hover:bg-yellow-600 rounded-xl mx-2 cursor-pointer duration-300 hover:text-black font-semibold'>Accueil</Link>
            <Link to="/Aide" className='p-4 hover:bg-yellow-600 rounded-xl mx-2 cursor-pointer duration-300 hover:text-black font-semibold'>Aide</Link>
          </li>
        {auth ?
        <div
          className='px-4 mt-2 cursor-pointer  '
          >
       <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          padding: 0, // Supprime le padding interne du bouton
          display: 'flex', // Utilise le flexbox
          justifyContent: 'center', // Centre l'icône horizontalement
          alignItems: 'center', // Centre l'icône verticalement
        }}
      >
        <FaUserCircle size={40} color="white" />
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
        {uid && uid.userRole === "admin" && <MenuItem onClick={connectToAdmin}>Admin </MenuItem>}
        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
      </Menu> 
      
        </div> : <Link to="/login" className='p-4 hover:bg-yellow-600 rounded-xl mr-2 cursor-pointer duration-300 hover:text-black font-semibold'>Connexion</Link> }
      </ul>
    </div>
  );
};

export default Navbar;