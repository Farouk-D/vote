import React from 'react';
import { useForm } from "react-hook-form";
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
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        if (data.password !== data.passwordC) {
            return alert("Mauvaise entrée de mot de passe")
        }
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/getUser`, { userMail: data.email });
            if (response.status === 200) {
                const code = Math.floor(Math.random() * 1000000);
                await sendAuthMail(data.email, code);
                alert(response.data.message)
                navigate("/verif", { state: { code, userMail: data.email, password: data.password, userRole: "user" } })
            } else if (response.status === 201) {
                alert(response.data.message)
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
    <div style={{ backgroundImage: 'url("https://www.pixel4k.com/wp-content/uploads/2020/12/triangle-solid-black-gold-4k_1608574481.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }} className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0">
      <div>
        <a href="/">
          <img src="/VoteLogo.jpg" alt="Logo" className="relative z-20 -mt-72 h-auto w-28 rounded-full border-t-2 border-l-2 border-r-2 border-yellow-700" />  
        </a>
      </div>
      <div className="absolute z-10 w-full px-8 py-10 overflow-hidden bg-black/80 shadow-md sm:max-w-md sm:rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-4">
            <label htmlFor="email" className="block text-lg font-medium text-amber-300">E-mail</label>
            <div className="flex flex-col items-start">
              <input type="email" name="email" className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {...register("email", { required: true, maxLength: 30 })} />
              {errors.email && errors.email.type === "required" && (<SpanAlerte message="Veuillez saisir une adresse e-mail" />)}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-lg font-medium text-amber-300">Mot de passe</label>
            <div className="flex flex-col items-start">
              <input type="password" name="password" className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {...register("password", { required: true, maxLength: 30 })} />
              {errors.password && errors.password.type === "required" && (<SpanAlerte message="Veuillez saisir un mot de passe" />)}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="password_confirmation" className="block text-lg font-medium text-amber-300">Confirmez votre mot de passe</label>
            <div className="flex flex-col items-start">
              <input type="password" name="password_confirmation" className="block border p-1.5 w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" {...register("passwordC", { required: true, maxLength: 30 })} />
              {errors.passwordC && errors.passwordC.type === "required" && (<SpanAlerte message="Vous devez confirmez votre mot de passe" />)}
            </div>
          </div>

          <div className="flex items-center justify-end mt-8">
            <a className="text-sm text-amber-300 underline hover:text-amber-500" href="/login">Déjà inscrit ?</a>
            <button type="submit" className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-amber-600 border-2 border-transparent rounded-md hover:bg-black hover:border-amber-600">S'incrire</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;