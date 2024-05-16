import React, { useContext,useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { UidContext } from "../AppContext";

const AdminComponent = () => {
    const uid = useContext(UidContext);
    const [isAllowed,setIsAllowed] = useState(false)
    const navigate = useNavigate()
    

    const {
      register,
      handleSubmit,
      formState: {errors},
  } = useForm()

    axios.defaults.withCredentials = true;
  
    useEffect(() => {
      console.log(uid)
      if (uid && uid.userRole === "admin") {setIsAllowed(true)}
    }, []);

  
    const handleDeleteVote = () => {
      axios.delete(`${process.env.REACT_APP_API_URL}/vote/deleteVote`).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
    }
    const handleCreateVote = (data) => {
      let currentDate = new Date();
      let dateEnd = new Date(currentDate.getTime() + 5 * 60000); 
      let formattedDateEnd = dateEnd.toISOString();
      axios.post(`${process.env.REACT_APP_API_URL}/vote/createVote`,{dateEnd:formattedDateEnd,dateDisplay:"2024-05-01T12:00:00"}).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
    }
    const handleStartDecrypt = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/admin/startDecrypt`).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
    }
    const handleVerifyAllDecrypt = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/admin/verifyAllDecrypt`).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
    }
    const handleDecrypt = (data) => {
      console.log(data)
      const indice = data.ind
      const share = data.cle
      axios.post(`${process.env.REACT_APP_API_URL}/admin/decrypt`,{adminMail:uid.userMail,share,indice}).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
      
    }
    const handleLogOut = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/auth/logout`).then(res => {
        if (res.data.valid) {navigate("/")}
      }).catch(err => console.log(err))
    }
  

return  isAllowed ?  (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-blue-500 p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Mon Application</h1>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md" onClick={handleVerifyAllDecrypt}>Liste des votes</button>
            <button className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md" onClick={handleDeleteVote}>Supprimer le vote en cours</button>
            <button className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md" onClick={handleCreateVote}>Créer un vote</button>
            <button className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md" onClick={handleStartDecrypt}>Lancement du déchiffrement</button>
            <form className="space-x-3 flex py-2" onSubmit={handleSubmit(handleDecrypt)}>
              <div>
                <label htmlFor="indiceSelect" className="text-blue-500">Indice de la clé de déchiffrement :</label>
                <select {...register("ind",{required: true})}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <input type="text" {...register("cle",{required: true})} placeholder="Clé de déchiffrement" />
              <button type="submit" className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md">Déchiffrer </button>
            </form>
            <button className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md" onClick={handleLogOut}>Déconnexion </button>
          </div>
        </div>
      </header>
      <main className="flex-grow p-4">
      </main>
      <div>
      </div>
    </div>
  ) : "Vous n'etes pas autorisé a etre ici "

}

export default AdminComponent