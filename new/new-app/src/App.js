import React, { Component } from 'react'
import logo from './logo.svg';
import Home from "./components/Home"
import About from "./components/About"
import Login from "./components/Login"
import NavBar from "./components/NavBar"
//import Member from "./Member"
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Route, Link} from "react-router-dom"
const color="#F9F3F3";

function App() {
  return (
    <div style={{backgroundColor: color}}>
    <BrowserRouter>
      <NavBar />
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/about" component={About} />
    </BrowserRouter>
</div>
  );
}

export default App;