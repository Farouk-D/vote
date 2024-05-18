import { useNavigate,useState} from "react-router-dom"; // This will be used to navigate to the login page
import React,{useContext} from "react"
import { UidContext } from "../AppContext";
import Swal from 'sweetalert2'
import axios from 'axios';

export default function Accueil() {
  const uid = useContext(UidContext);
  console.log("In Accueil, setClePub is: ", typeof setClePub);
  const navigate = useNavigate(); // Hook to navigate

  const checkVote = async () => {
    if (uid) {
      await axios({
      method: "get",
      url:`${process.env.REACT_APP_API_URL}/vote/getClePub`,
      withCredentials: true,
    }).then(async (res) => {
      if (res.data.valid) {
        console.log(res.data.pubCle)
        navigate("/VoteBO",{ state: { clePub:res.data.pubCle } })
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Aucun vote est en cours',
          background: "#00000a",
          color: "#fff"
        });
      }
    }).catch((err) => console.log(err));
  } else {
    Swal.fire({
      icon: 'warning',
      title: " Veuillez Vous connectez d'abord ",
      background: "#00000a",
      color: "#fff"
    });
    navigate("/login")
  }
}
    
  


  return(
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: 'url("https://www.pixel4k.com/wp-content/uploads/2020/12/triangle-solid-black-gold-4k_1608574481.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-gradient-to-b from-yellow-700 to-transparent border-t-2 border-yellow-600">         
        <h1 className="py-5"> </h1>
      </div>
      <div className=" flex flex-col items-center">
        <h1 className="text-white text-center text-5xl md:text-6xl font-bold font-serif mb-2 mt-8 md:mt-6 ml-6 sm:ml-16">BIENVENUE !</h1>
        <p className="hidden lg:flex justify-center text-white text-center text-md md:text-xl font-semibold bg-gray-950 w-4/5 md:w-1/2 mt-2 rounded-xl border-2 py-1 px-2">
          Votez dès maintenant pour votre favori au Ballon d'Or 2024 <br /> et pour l'Algérien de la décennie !
        </p>
        <p className="flex lg:hidden text-white text-center text-md md:text-xl font-semibold bg-gray-950 w-4/5 md:w-1/2 mt-2 rounded-xl border-2 py-1 px-2">
          Votez dès maintenant pour votre favori au Ballon d'Or 2024 et pour l'Algérien de la décennie !
        </p>
      </div>
      <div className=" flex flex-col items-center">
        <button  onClick ={checkVote}
        className="mt-20 py-8 px-10 font-serif bg-gradient-to-br from-yellow-700 to-orange-300 hover:brightness-90 hover:scale-105 w-4/5 md:w-2/5 text-white text-5xl lg:text-6xl font-bold rounded-3xl transition duration-200 ease-in-out">
       
          VOTEZ ! 
          <br /> <p className="text-2xl">Vote / صوتوا / Votar</p>
        </button>
      </div>
    </div>
  );
}