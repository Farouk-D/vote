import React from 'react';

const BO = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
         style={{ backgroundImage: 'url("/Background.jpg")' }}>
      
      <p className="hidden lg:flex justify-center mb-10 -mt-28 text-white text-center text-md md:text-3xl font-semibold bg-gray-950 w-4/5 md:w-1/2 rounded-xl border-2 py-1 px-2">
          Votez dès maintenant pour votre favori au Ballon d'Or 2024
        </p>
      <div className="flex items-center justify-center w-full">
        <button onClick={() => { alert('Vote enregistré pour la première image!'); }}
                className="mx-2">
          <img src="/ViniciusBellingham.png" alt="Première Image" className="w-96 h-96 shadow-lg hover:shadow-xl transition-shadow duration-300" />
        </button>
        <button onClick={() => { alert('Vote enregistré pour la deuxième image!'); }}
                className="mx-2">
          <img src="HediVSFarouk.png" alt="Deuxième Image" className="w-96 h-96 shadow-lg hover:shadow-xl transition-shadow duration-300" />
        </button>
      </div>
    </div>
  );
}

export default BO;
