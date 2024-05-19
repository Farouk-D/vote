import React, { useEffect, useState } from "react"
import axios from 'axios';

const Result = () => {
    const [judePercent,setJudePercent] = useState(null)
    const [viniPercent,setViniPercent] = useState(null)
    useEffect(() => {
 
          axios({
                method: "get",
                url:`${process.env.REACT_APP_API_URL}/vote/getResult`,
                withCredentials: true,
                }).then(res => {
                    if (res.data.valid ) {
                        setViniPercent(res.data.result === 0 ? 0 : res.data.result)
                        setJudePercent(res.data.result === 0 ? 0 : 100 - res.data.result)
                    }
                }).catch(err => console.log(err))
  
      }, []);

    return judePercent!==null && (
    <div className="flex flex-col min-h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url("/Background.jpg")' }}>

    <div className="flex flex-col space-y-6 w-full mt-8  md:ml-20 lg:ml-8">
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <img src="/Jude.jpg" alt="Première Image" className="transition-all duration-300 ease-in-out w-80 h-80 shadow-lg hover:shadow-xl" />
            <div className="bg-transparent rounded-lg w-full md:w-2/3 p-4">
                <div className="w-full h-8 bg-gray-400 rounded-full">
                    <div className="h-full text-center text-xl text-white bg-yellow-700 rounded-full" style={{ width: `${judePercent}%` }}>
                    {judePercent !== 0 && {judePercent}%"" }
                    </div>
                </div>
            </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <img src="Vini.jpg" alt="Deuxième Image" className="transition-all duration-300 ease-in-out w-80 h-80 shadow-lg hover:shadow-xl" />
            <div className="bg-transparent rounded-lg w-full md:w-2/3 p-4">
                <div className="w-full h-8 bg-gray-400 rounded-full">
                    <div className="h-full text-center text-xl text-white bg-yellow-700 rounded-full" style={{ width: `${viniPercent}%` }}>
                        {viniPercent !== 0 && {viniPercent}%"" }
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  );
}

export default Result;
