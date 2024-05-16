import React, { useEffect, useState } from "react"
import {useForm} from "react-hook-form"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import bigInt from 'big-integer';

function Vote() {
  
  const [isAllowed,setIsAllowed] = useState(false)
  axios.defaults.withCredentials = true;

  const crypt = async (userVote) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}vote/getClePub`)
      const publicKey = response.data.pubCle  
      if (response.data.valid) {
        let n = bigInt(publicKey[0])
        let g = bigInt(publicKey[1])
        const result = await axios.post(`${process.env.REACT_APP_API_URL}/vote/calculR`, {n})
        let cryptVote = g.modPow(bigInt(userVote), n.multiply(n)).multiply(bigInt(result.data.r).modPow(n, n.multiply(n))).mod(n.multiply(n)).toString();
        return cryptVote
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
    
        axios.get(`${process.env.REACT_APP_API_URL}/vote/getVoteAuth`).then( res => {
          if (res.data.valid) {
            setIsAllowed(true)
          } 
      }).catch(err => console.log(err))

  }, []);

  const handleLogOut = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`).then(res => {
      console.log(res.data.valid)
      if (res.data.valid) {navigate("/")}
    }).catch(err => console.log(err))
  }
  const onSubmit = async (data) => {
    const userId = data.id;
    const userVote = data.vote;
  
    try {
      const testVoteResponse = await axios.post(`${process.env.REACT_APP_API_URL}/vote/testVote`, { userId })
      alert(testVoteResponse.data.message)
  
      if (testVoteResponse.data.valid) {
        const resultat = await crypt(userVote)
        const postVoteResponse = await axios.post(`${process.env.REACT_APP_API_URL}/vote/postVote`, {
          userId,
          voteTime: new Date().getTime(),
          resultat
        })
        alert(postVoteResponse.data.message)
      } else {
        alert(testVoteResponse.data.message)
      }
    } catch (err) {
      alert("Une erreur s'est produite lors de la soumission du vote : " + err.message)
    }
  };
  return isAllowed ? (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Choix de Joueur</h2>
      <form action="##" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="id" className="block mb-2">Numéro ID :</label>
        <input type="text" id="id" name="id" className="block w-full mb-4 p-2 border border-gray-300 rounded-md" 
        {...register("id",{required: true,maxLength:30})}/>
        {errors.id && errors.id.type === "required" && (
                            <span role="alert" className="text-red-500 text-sm ">ID requis</span>
                        )}
        <label htmlFor="choix" className="block mb-2">Faites votre choix :</label>
        <select id="choix" name="choix" required className="block w-full mb-4 p-2 border border-gray-300 rounded-md"
        {...register("vote", { required: true})}>
          <option value="0">Cristiano Ronaldo (CR7)</option>
          <option value="1">Lionel Messi</option>
        </select>
        {errors.vote && errors.vote.type === "required" && (
        <p className="text-red-500">Ce champ est requis.</p>
      )}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">Soumettre le vote</button>

        
      </form>
      <button  className="bg-blue-500 text-white py-2 px-4 rounded-md" onClick={handleLogOut}>Deconnexion</button>
    </div>
  ) : "Vous n'etes pas autorisé a etre ici, Veuillez vous connecter ou vous inscrire "
  }

export default Vote;
