import React from 'react';
import { useState, useEffect } from 'react';
import {useForm} from "react-hook-form";
import { SpanAlerte } from './SpanAlerte';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';


const Connexion = () => {

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()

    axios.defaults.withCredentials = true

    const backgrounds = [
      '/ViniciusBellingham.png'

  ];

  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
      const intervalId = setInterval(() => {
          setBgIndex((current) => (current + 1) % backgrounds.length);
      }, 10000); // Change l'image toutes les 10 secondes

      return () => clearInterval(intervalId); // Nettoyage de l'intervalle
  }, []);

    const onSubmit = async (data) => {

       
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`,{userMail:data.email,password:data.password});
            if (response.status === 200) {
                Cookies.set("token", response.data.token, { expires: 7 });
                alert("Connexion reussi")
                navigate("/")
                window.location.reload();
                }
            else {alert("Email ou Mot de passe Incorrect")}
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <div style={{ backgroundImage: `url(${backgrounds[bgIndex]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0">

                <div>
                    <a href="/">
                      <img src="/VoteLogo.jpg" alt="Logo" className="h-auto w-48" />  

                    </a>
                </div>
                <div className="w-full px-6 py-4 overflow-hidden bg-black shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                       
                        <div className="mt-10">
                            <label
                                htmlFor="email"
                                className="block text-lg font-medium text-amber-300 undefined"
                            >
                                Email
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="email"
                                    name="email"
                                    className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register("email",{required: true,maxLength:30})}/>
                                {errors.email && errors.email.type === "required" && (
                                <SpanAlerte message = "email requis"/>
                                )}  
                                
                            </div>
                        </div>
                        <div className="mt-10 mb-10">
                            <label
                                htmlFor="password"
                                className="block text-lg font-medium text-amber-300 undefined"
                            >
                                Mot De Passe
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="password"
                                    className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register("password",{required: true,maxLength:30})}/>
                            {errors.password && errors.password.type === "required" && (
                            <SpanAlerte message = "Password requis"/>
                            )} 
                                
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-end mt-4 mb-10">
                            <a
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                                href="/inscription"
                            >
                                New?
                            </a>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Connexion