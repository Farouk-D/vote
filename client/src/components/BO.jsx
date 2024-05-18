import React, { useEffect, useState,useContext } from "react"
import {useForm} from "react-hook-form"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom";
import bigInt from 'big-integer';
import { UidContext } from "../AppContext";
import Swal from 'sweetalert2'

const BO = () => {
  const location = useLocation()
  const { clePub } = location.state || null;
  const [voteSelected,setVoteSelected] = useState("")
  const [isAllowed,setIsAllowed] = useState(false)
  const [value,setValue] = useState(null)
  const uid = useContext(UidContext);
  axios.defaults.withCredentials = true;

  function Gen_Coprime(n){
    // Coprime generation function. Generates a random coprime number of n.
    let ret;
    while (true) {
      ret = bigInt.randBetween(1, n.minus(1));
      if (bigInt.gcd(ret, n) == 1) { 
          return ret
      }
    }
  }

  const crypt = async (userVote) => {
    try {
      if (clePub) {
        let n = bigInt(clePub[0])
        let g = bigInt(clePub[1])
        let x = Gen_Coprime(n)
        let temp1 = g.modPow(bigInt(userVote), n.multiply(n))
        let temp2 = x.modPow(n, n.multiply(n))
        let cryptVote = temp1.multiply(temp2).mod(n.multiply(n))
        return cryptVote.toString()
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Error in crypt function:", error)
      throw error
    }
  };
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm()

  const navigate = useNavigate()
  useEffect(() => {
    if (uid) {setIsAllowed(true)}
  }, []);


  const onSubmit = async (data) => {
    const userId = data.id;
    const userVote = value;
  
    try {
      const testVoteResponse = await axios.post(`${process.env.REACT_APP_API_URL}/vote/testVote/${uid._id}`, { userId })
  
      if (testVoteResponse.data.valid ) {
        if (userVote ){
          const resultat = await crypt(userVote)
          const postVoteResponse = await axios.post(`${process.env.REACT_APP_API_URL}/vote/postVote`, {
            userId,
            voteTime: new Date().getTime(),
            resultat
          })
          Swal.fire({
            icon: postVoteResponse.data.valid ? "success" : "warning",
            title: postVoteResponse.data.message ,
            background: "#00000a",
            color: "#fff"
          });
        } else {
          Swal.fire({
            icon: 'Warning',
            title: 'Veuillez sélectionner une image ',
            background: "#00000a",
            color: "#fff"
          });
      }
      } else {
        Swal.fire({
          icon: 'warning',
          title: testVoteResponse.data.message,
          background: "#00000a",
          color: "#fff"
        });
      }
    } catch (err) {
      alert("Une erreur s'est produite lors de la soumission du vote : " + err.message)
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
         style={{ backgroundImage: 'url("/Background.jpg")' }}>
      
        <p className="hidden lg:flex justify-center mb-10 -mt-48 text-white text-center text-md md:text-3xl font-semibold bg-gray-950 w-4/5 md:w-1/2 rounded-xl border-2 py-1 px-2">
          Votez pour votre favori au Ballon d'Or 2024
        </p>

        
      <div className={`flex items-center justify-center w-full`}>
        <button onClick={() => {
        setVoteSelected("Jude")
        setValue("0")
      }}
                className="mx-2">
          <img src="/Jude.jpg" alt="Première Image" className={`${voteSelected === "Jude" ? "border-4 border-yellow-600 w-96 h-96" : "w-80 h-80"}  shadow-lg hover:shadow-xl transition-shadow duration-300`}/>
        </button>
        <button onClick={() => {
        setVoteSelected("Diable")
        setValue("1")
      }}
                className="mx-2">
          <img src="Vini.jpg" alt="Deuxième Image" className={`${voteSelected === "Diable" ? "border-4 border-yellow-600 w-96 h-96" : "w-80 h-80"} shadow-lg hover:shadow-xl transition-shadow duration-300`} />
        </button>
      </div>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center "> {/* Cette ligne ajoute un centrage complet */}
          <form action="##" className="w-full max-w-lg"onSubmit={handleSubmit(onSubmit)}> {/* Contrôle la largeur maximale du formulaire */}
            <input 
              type="text" 
              id="id" 
              name="id" 
              placeholder="Entrez votre id" 
              className="block mt-10 text-2xl w-full mb-4 p-2 text-center border text-white border-yellow-600 bg-gray-950 rounded-md" 
              {...register("id", { required: true, maxLength: 30 })}
            />
            {errors.id && errors.id.type === "required" && (
              <span role="alert" className="text-red-500 text-sm">ID requis</span>
            )}
            <button 
              type="submit" 
              className="bg-black text-amber-600 text-2xl mt-4 py-2 px-4 rounded-md"
            >
              Soumettre le vote
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
}

export default BO;
