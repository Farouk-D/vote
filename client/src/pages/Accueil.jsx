import React from "react";

export default function Accueil() {

  return(
    <div className="flex flex-col min-h-screen bg-black">
      <div className="bg-gradient-to-b from-yellow-600 to-black border-t-2 border-yellow-600">         
        <h1 className="py-5"> </h1>
      </div>
      <div>
        <h1 className="text-white text-2xl text-center sm:text-3xl font-bold font-serif mb-0 mt-4 ml-6 sm:ml-16">BIENVENUE !</h1>
      </div>
    </div>
  );

}