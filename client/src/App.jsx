import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Dashboard from './pages/dashboard'
import Messages from './pages/Messages'
import Services from './pages/Services'
import FindWork from './pages/FindWork'
import FindTalent from './pages/FindTalent'

const App = () => {
  return (
    <div className='px-4 sm:px-[5vm] md:px-[7vm] lg:px-[9vm]'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/services' element={<Services />} />
        <Route path='/find-work' element={<FindWork />} />
        <Route path='/find-talent' element={<FindTalent />} />
      </Routes>
    </div>
  )
}

export default App

