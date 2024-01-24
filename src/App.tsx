import './App.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { AuthContextProvider } from "./contexts/AuthContext"
import { DefaultNavigation } from "./contexts/DefaultNavigation"
import { HomePage } from './pages/HomePage';
import { AdministrationPage } from './pages/AdministrationPage';
import { ReplayDetailsPage } from './pages/ReplayDetailsPage';
import { UserDetailsPage } from './pages/UserDetailsPage';
import { LobbyUserDetailsPage } from './pages/LobbyUserDetailsPage';
import { LocalRatingsPage } from './pages/LocalRatingsPage';
import { ReplaysPage } from './pages/ReplaysPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AboutPage } from './pages/AboutPage';
import { ReplayUploadPage } from './pages/ReplayUploadPage';
import { useEffect } from 'react';
import { init } from './nightwind.ts'

function App() {

  useEffect(() => {
    init();
  }, [])

  return (
      <AuthContextProvider>
        <Router>
          <Routes>
            <Route path='/' element={<DefaultNavigation />}></Route>
            <Route path='/Administration' element={<AdministrationPage />}></Route>
            <Route path='/Home' element={<HomePage />}></Route>
            <Route path='/Replays' element={<ReplaysPage />}></Route>
            <Route path='/PrivacyPolicy' element={<PrivacyPolicyPage />}></Route>
            <Route path='/Replays/ReplayDetails/:matchId' element={<ReplayDetailsPage />}></Route>
            <Route path='/UserDetails/:userId' element={<UserDetailsPage />}></Route>
            <Route path='/LobbyUserDetails/:userId' element={<LobbyUserDetailsPage />}></Route>
            <Route path='/LocalRatings' element={<LocalRatingsPage />}></Route>
            <Route path='/About' element={<AboutPage />}></Route>
            <Route path='/Replays/Upload' element={<ReplayUploadPage />}></Route>
          </Routes>
        </Router>
      </AuthContextProvider>
  )
}

export default App
