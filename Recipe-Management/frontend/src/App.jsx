import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SingUp from "./pages/Singup/SingUp";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SingUp />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;