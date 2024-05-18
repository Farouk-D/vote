import React, {useState} from 'react';

const BO = () => {
  const [voteSelected,setVoteSelected] = useState("")
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
         style={{ backgroundImage: 'url("/Background.jpg")' }}>
      
        <p className="hidden lg:flex justify-center mb-10 -mt-48 text-white text-center text-md md:text-3xl font-semibold bg-gray-950 w-4/5 md:w-1/2 rounded-xl border-2 py-1 px-2">
          Votez dès maintenant pour votre favori au Ballon d'Or 2024
        </p>
      <div className={`flex items-center justify-center w-full`}>
        <button onClick={() => setVoteSelected("Jude")}
                className="mx-2">
          <img src="/Jude.jpg" alt="Première Image" className={`${voteSelected === "Jude" ? "border-4 border-yellow-600 w-96 h-96" : "w-80 h-80"}  shadow-lg hover:shadow-xl transition-shadow duration-300`}/>
        </button>
        <button onClick={() => setVoteSelected("Diable")}
                className="mx-2">
          <img src="Vini.jpg" alt="Deuxième Image" className={`${voteSelected === "Diable" ? "border-4 border-yellow-600 w-96 h-96" : "w-80 h-80"} shadow-lg hover:shadow-xl transition-shadow duration-300`} />
        </button>
      </div>
    </div>
  );
}

export default BO;
