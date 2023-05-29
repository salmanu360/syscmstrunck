import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App"
import { BrowserRouter } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<BrowserRouter basename="/syscms2/view"><App /></BrowserRouter> );
// root.render(<BrowserRouter basename="/view"><App /></BrowserRouter> );

//----------------------------------------------------------------------------//
//Please Checking "package.json" file, homepage link when checking or changing.//
//http://syscms1.infollective.com/view/                                      //
//http://192.168.1.23:81/syscms2/view/      
//http://localhost/ogps/view/                                     //
//--------------------------------------------------------------------------//

