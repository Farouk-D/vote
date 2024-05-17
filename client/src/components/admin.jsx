import React, { useContext,useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { UidContext } from "../AppContext";
import { MdHowToVote } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoMdCloudUpload } from "react-icons/io";
import { SiCryptpad } from "react-icons/si";
import { FcDataEncryption } from "react-icons/fc";
import { MdLogout } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";


const AdminComponent = () => {
    const uid = useContext(UidContext);
    const navigate = useNavigate()
    const [isAllowed,setIsAllowed] = useState(false)
    const [search, setSearch] = useState("");
    const [users,setUsers] = useState(null)
    

    const {
      register,
      handleSubmit,
      formState: {errors},
  } = useForm()

    axios.defaults.withCredentials = true;

    useEffect(() => {
      if (uid && uid.userRole !== "admin") {navigate("/")}
      else {
        setIsAllowed(true)
        axios.get(`${process.env.REACT_APP_API_URL}/auth/getUsers`).then(res => {
          console.log(res.data)
          setUsers(res.data)
        }).catch(err => console.log(err))

      }
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

    const handleEndDecrypt = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/admin/endDecrypt`).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
    }

    const handleVerifyAllDecrypt = () => {
      axios.get(`${process.env.REACT_APP_API_URL}/admin/verifyAllDecrypt`).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
    }
    const handleDecrypt = (data) => {
      const indice = data.ind
      const share = data.cle
      console.log(data)
      console.log(typeof(indice))
      console.log(typeof(share))
      console.log(uid.userMail)
      axios.post(`${process.env.REACT_APP_API_URL}/admin/decrypt`,{adminMail:uid.userMail,share,indice}).then(res => {
        alert(res.data.message)
      }).catch(err => console.log(err))
      
    }
    // Log out
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
      <aside className="bg-zinc-950 w-1/5 flex flex-col space-y-4 border-4 border-zinc-600">
        <button
          className="text-white  hover:bg-zinc-600 px-4 py-4 flex items-center"
          onClick={handleVerifyAllDecrypt}
        >
          <IoMdCloudUpload className="text-4xl mr-10"/>
          Mettre en ligne le Résultat
        </button>
    
        <button
           className="text-white hover:bg-zinc-600 px-4 py-4 flex items-center"
          onClick={handleCreateVote}
        > <MdHowToVote className="text-4xl mr-10"/>
          Créer un vote
        </button>
        <button
          className="text-white hover:bg-zinc-600 px-4 py-4 flex items-center"
          onClick={handleDeleteVote}
        >
          <RiDeleteBin5Fill className="text-4xl mr-10"/>
          Supprimer le vote en cours
        </button>
        <div className="border-2 border-zinc-600"></div>
        <button
          className="text-white hover:bg-zinc-600 px-4 py-4 rounded-md flex items-center"
          onClick={handleStartDecrypt}
        >
          <FcDataEncryption className="text-4xl mr-10"/>
          Lancement du déchiffrement
        </button>
        <form className="space-y-3 flex flex-col" onSubmit={handleSubmit(handleDecrypt)}>
          <div className="px-6 ">
            <label htmlFor="indiceSelect" className="text-white ">
              Indice de la clé de déchiffrement :
            </label>
            <select name="ind" required className="ml-2" {...register("ind", { required: true })}>
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
            className="px-6 py-2 rounded-md ml-4 mr-4"
            {...register("cle",{required: true})}
          />
          <button
            type="submit"
            className="text-white hover:bg-zinc-600 px-4 py-4 flex items-center"
          >
            <SiCryptpad className="text-4xl mr-10"/> 
            Déchiffrer
          </button>
        </form>
        <button
          className="text-white hover:bg-zinc-600 px-4 py-4 rounded-md flex items-center"
          onClick={handleEndDecrypt}
        >
          <FcDataEncryption className="text-4xl mr-10"/>
          Finir le décryptage
        </button>
        <div className="border-2 border-zinc-600"></div>
        <button
          className="text-white hover:bg-zinc-600 px-4 py-4 flex items-center"
          onClick={handleLogOut}
        >
          <MdLogout className="text-4xl mr-10"/> 
          Déconnexion
        </button>
      </aside>
      <main className="flex-grow p-4 w-2/3 bg-zinc-950 border-4 border-zinc-600">
        <div className=" bg-zinc-800 p-4 rounded-md shadow-md">
          <h2 className="text-2xl text-white font-bold mb-4">Rechercher les utilisateurs</h2>
          <input
                    type="text"
                    id="voice-search"
                    className="bg-black border border-amber-500 text-amber-500 text-sm font-semibold rounded-lg focus:border-amber-500 block w-full ps-10 p-2.5  "
                    placeholder="Entrez l'email d'un utilisateur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    required
                  />
        </div>
        <div className="mt-4 border border-zinc-600"></div>
        <div className="mt-4">
        {users && users
              .filter((user) =>
                user.userMail.toLowerCase().includes(search.toLowerCase())
              )
              .map((user, index) => (
                <div
                  key={index}
                  className="mb-2 p-4 rounded-md bg-[#4b4848] flex bg-opacity-55 items-center justify-center  hover:bg-opacity-40 hover:drop-shadow-lg

                "
                >
                  <p className="text-md  text-white min-w-[120px] ">
                    {user.userMail}
                  </p>
                  <p className=" text-2xl text-red-500 w-[50px] ml-auto cursor-pointer">
                    <MdDeleteForever />
                  </p>
                </div>
              ))}
        </div>
      </main>
    </div>
  );

}

export default AdminComponent