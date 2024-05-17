import React, { useContext,useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { UidContext } from "../AppContext";

const AdminComponent = () => {
    const uid = useContext(UidContext);
    const navigate = useNavigate()
    const [isAllowed,setIsAllowed] = useState(false)
    

    const {
      register,
      handleSubmit,
      formState: {errors},
  } = useForm()

    axios.defaults.withCredentials = true;

    useEffect(() => {
      if (uid && uid.userRole !== "admin") {navigate("/")}
      else {setIsAllowed(true)}
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
      axios.post(`${process.env.REACT_APP_API_URL}/vote/createVote`,{dateEnd:formattedDateEnd}).then(res => {
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
        if (res.data.valid) {
          navigate("/")
          window.location.reload();
        }
      }).catch(err => console.log(err))
    }
  

return  isAllowed && (
  <div className="bg-gray-100 min-h-screen flex">
      <aside className="bg-zinc-950 w-1/5 flex flex-col space-y-4">
        <button
          className="text-white  hover:bg-blue-100 px-4 py-4"
          onClick={handleVerifyAllDecrypt}
        >
          Afficher pour tous les Votes ! 
        </button>
    
        <button
          className="text-white hover:bg-blue-100 px-4 py-4"
          onClick={handleCreateVote}
        >
          Créer un vote
        </button>
        <button
          className="text-white hover:bg-blue-100 px-4 py-4"
          onClick={handleDeleteVote}
        >
          Supprimer le vote en cours
        </button>
        <div className="border"></div>
        <button
          className="text-white hover:bg-blue-100 px-4 py-4 rounded-md"
          onClick={handleStartDecrypt}
        >
          Lancement du déchiffrement
        </button>
        <form className="space-y-3 flex flex-col" onSubmit={handleDecrypt}>
          <div>
            <label htmlFor="indiceSelect" className="text-white">
              Indice de la clé de déchiffrement :
            </label>
            <select name="ind" required className="ml-2">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <input
            type="text"
            name="cle"
            required
            placeholder="Clé de déchiffrement"
            className="px-2 py-2 rounded-md"
          />
          <button
            type="submit"
            className="text-white hover:bg-blue-100 px-4 py-4 rounded-md"
          >
            Déchiffrer
          </button>
        </form>
        <div className="border"></div>
        <button
          className="text-white hover:bg-blue-100 px-4 py-4 rounded-md"
          onClick={handleLogOut}
        >
          Déconnexion
        </button>
      </aside>
      <main className="flex-grow p-4 w-2/3">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Zone d'administration</h2>
        </div>
      </main>
    </div>
  );

}

export default AdminComponent