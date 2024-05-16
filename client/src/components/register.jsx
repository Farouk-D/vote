
import React from 'react';
import {useForm} from "react-hook-form";
import { SpanAlerte } from './SpanAlerte';
import { sendAuthMail } from '../components/emailSender';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Registration = () => {
    axios.defaults.withCredentials = true;
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm()

    const onSubmit = async (data) => {
        if (data.password !== data.passwordC) {return alert("Mauvaise entrée de mot de passe")}
        try {
            const response = await axios.post("http://localhost:3001/auth/getUser",{userMail:data.email});
            if (response.status == 200) {
                const code = Math.floor(Math.random() * 1000000);
                await sendAuthMail(data.email,code);
                alert(response.data.message)
                navigate("/verif", {state: {code,userMail:data.email,password:data.password,userRole:"user"}})
             } else  if (response.status == 201){
                alert(response.data.message)
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
                        <div className="mt-4">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Password
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
                        <div className="mt-4">
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-700 undefined"
                            >
                                Confirm Password
                            </label>
                            <div className="flex flex-col items-start">
                                <input
                                    type="password"
                                    name="password_confirmation"
                                    className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    {...register("passwordC",{required: true,maxLength:30})}/>
                            {errors.passwordC && errors.passwordC.type === "required" && (
                            <SpanAlerte message = "Confirm Password requis"/>
                            )} 
                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <a
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                                href="/login"
                            >
                                Already registered?
                            </a>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-900 border border-transparent rounded-md active:bg-gray-900 false"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration