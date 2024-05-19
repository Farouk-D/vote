import React, { useEffect, useState,useContext } from "react"
import {useForm} from "react-hook-form"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom";
import bigInt from 'big-integer';
import { UidContext } from "../AppContext";
import Swal from 'sweetalert2'
import Timer3 from "./countdown";

const BO = () => {
  const location = useLocation()
  const { clePub,dateEnd } = location.state || null;
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
      
        <div className="mt-12 sm:mt-0"><Timer3 dateEnd={dateEnd}/></div>
        
      <div className="flex flex-col sm:flex-row items-center justify-center w-full mt-20 ">
        <button onClick={() => {
        setVoteSelected("Jude")
        setValue("0")
      }}
                className="mx-2 my-2 sm:my-0">
          <img src="/Jude.jpg" alt="Première Image" className={`transition-all duration-300 ease-in-out ${voteSelected === "Jude" ? "border-8 border-yellow-600 w-96 h-96 transform scale-100" : "w-80 h-80"} shadow-lg hover:shadow-xl`} />
        </button>
        <button onClick={() => {
        setVoteSelected("Diable")
        setValue("1")
      }}
                className="mx-2">
          <img src="Vini.jpg" alt="Deuxième Image" className={`transition-all duration-300 ease-in-out ${voteSelected === "Diable" ? "border-8 border-yellow-600 w-96 h-96 transform scale-100" : "w-80 h-80"} shadow-lg hover:shadow-xl`}  />
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
              className="block mt-2 sm:mt-6 text-2xl w-full p-2 text-center border text-white border-yellow-600 bg-gray-950 rounded-md" 
              {...register("id", { required: true, maxLength: 30 })}
            />
            {errors.id && errors.id.type === "required" && (
              <span role="alert" className="text-red-500 text-sm">ID requis</span>
            )}
            <button 
              type="submit" 
              className="bg-black hover:bg-amber-600 mt-2 sm:mt-6 w-full text-amber-600 border-2 hover:border-gray-950 border-amber-600 hover:text-black font-semibold text-2xl py-2 px-4 rounded-md">
              Soumettre le vote
            </button>
          </form>
        </div>
      </div>

      
    </div>
  );
}

export default BO;
