import React, { useState,useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import axios from 'axios';
import { UidContext} from './AppContext';
import Vote from './pages/Vote';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPage from './pages/AdminPage';
import ConfirmRegister from './pages/ConfirmRegister';
import NavigBar from './components/NavigBar';
import Accueil from './pages/Accueil';
import Aide from './pages/Aide';
import AccueilVote from './pages/AccueilVote';
import VoteBO from './pages/VoteBO';

function App() {
    const [uid, setUid] = useState(null)
    useEffect(() => {
      async function checkAuth() {
        await axios({
          method: "get",
          url: `${process.env.REACT_APP_API_URL}/jwtid`,
          withCredentials: true,
        }).then(async (res) => {
          if (res.status !== 200) {
            setUid(res.data)
          }
        })
          .catch((err) => console.log(err));
      }
      checkAuth()
      console.log(uid)

    }, [])
    return (
      <UidContext.Provider value={uid}>
        <Router>
          <div className="w-full h-screen bg-cover bg-center overflow-hidden">
            <NavigBar/>
            <main >
              <Routes>
                <Route path="/inscription" element={<Register />}/>
                <Route path="/Login" element={<Login />}/>
                <Route path="/Vote" element={uid ? <Vote /> : <Navigate to="/" />}/>
                <Route path="/verif" element={ <ConfirmRegister />} />
                <Route path="/admin" element={uid ? <AdminPage /> : <Navigate to="/" />} />
                <Route path="/Aide" element={< Aide />} />
                <Route path="/VoteBO" element={<VoteBO />}/>
                <Route path="/Choix" element={<AccueilVote />}/>
                <Route path="*" element={<h2 className='dark:text-[#0f0f0f] '>La page n'existe pas</h2>} />
                <Route path="/" element={ <Accueil />} />
              </Routes>
            </main>
          </div>
        </Router>
      </UidContext.Provider>
    )

}

export default App;