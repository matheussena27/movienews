import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './components/pages/Home/Home';
import Sobre from './components/pages/Sobre/Sobre';
import Login from './components/pages/Login/Login';
import Register from './components/pages/Register/Register';
import Filme from './components/pages/Filme/Filme';
import Logout from './components/Logout';
import Resultados from './components/pages/Resultados/Resultados';
import Password from './components/pages/EditPassword/EditPassword';
import Menu from './components/layout/Menu/Menu'

function App() {
  return (
    <Router>
      <Menu/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/filme" element={<Filme />} />
       <Route path="/logout" element={<Logout />} />
       <Route path="/register" element={<Register />} />
       <Route path="/password" element={<Password />} />
      </Routes>
    </Router>
  );
}

export default App;
