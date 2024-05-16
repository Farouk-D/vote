
import React from 'react';
import {useForm} from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';
import { SpanAlerte } from './SpanAlerte';
import { sendAuthMail } from './emailSender';
import axios from 'axios';



const Verification = () => {

    const location = useLocation()
    const {code,userMail,password,userRole} = location.state;
    
   
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()

    const onSubmit = async (data) => {
        console.log(userMail)
        try {

            if (data.code == code ) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`,{userMail,password,userRole});
                if (response.status === 201) {
                    await sendAuthMail(userMail,response.data.ID)
                    alert("Inscription reussi, Votre ID de vote a été envoyé par mail")
                    navigate("/Vote")
                }
            }
            else {
                alert("Mauvais code")
            }
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
                <div>
                    <a href="/">
                        <h3 className="text-4xl font-bold text-purple-600">
                            Logo
                        </h3>
                    </a>
                </div>
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={handleSubmit(onSubmit)}>
                       
                        <div className="mt-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Code de vérification
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="text"
                                    name="code"
                                    className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register("code",{required: true,maxLength:30})}/>
                                {errors.code && errors.code.type === "required" && (
                                <SpanAlerte message = "code requis"/>
                                )}  
                                
                            </div>
                        </div>
                    
                        
                        <div className="flex items-center justify-end mt-4">
                            <a
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                                href="/"
                            >
                                Revenir au menu ?
                            </a>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                            >
                                Finish Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Verification