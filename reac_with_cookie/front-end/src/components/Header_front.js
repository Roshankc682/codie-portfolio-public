import React , { useState , useEffect  } from "react";
import './Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import axios from 'axios'

import {Navbar , Nav } from 'react-bootstrap';
import './Header.css';
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Logout from "./Logout";
import Portfolio from "./Portfolio";
import { waitForDomChange } from "@testing-library/react";


const Header_front = () => {
  
  // const backend_url = "https://api-v1-backend.herokuapp.com";
  const backend_url = "http://localhost:8000";

  const [setJwt, UpdatesetJwt] = useState(null);
  const [_loaded_, Update_loaded_] = useState(null);

const [_image_name_, update_image_name_] = useState("http://"+window.location.host+"/profile.png");
  // const backend_url = "https://api-v1-backend.herokuapp.com";
  
  useEffect(() => {
        Update_loaded_(localStorage.getItem("loaded"))

        axios.post(backend_url+'/api/access/refresh/',{payload:null},{ withCredentials: true })
            .then((respose) => {
            // console.log(res.data)
                  try{
                        UpdatesetJwt(respose.data["access"]);
                    }catch(e){
                        UpdatesetJwt(null);
                    }
            })
            .catch((error) => {
                    try{
                        UpdatesetJwt(null);
                    }catch(e){}
            })
  },[]);
  
  useEffect(() => {
  
    if(setJwt != null){
    const interval = setInterval(() => {
      axios.get(backend_url+'/api/token/new/',{ headers: {'Authorization': `Bearer ${setJwt}`},withCredentials: true})
          .then((respose) => {
            // console.log(respose.data)
            try{
            UpdatesetJwt(respose.data["access"]);
            }catch(e)
            {
               UpdatesetJwt(null);
            }
            
          })
          .catch((error) => {
              // console.log(error)
              UpdatesetJwt(null);
          })
    }, 270000);
    return () => clearInterval(interval);
  }
  
  }, [setJwt]);

  localStorage.setItem("_____google___", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  localStorage.setItem("_____twist___", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  localStorage.setItem("________", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  
function store_date(){
  localStorage.setItem("__from__genreate__", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  localStorage.setItem("__auth__token__", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  localStorage.setItem("__token__", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  localStorage.setItem("loaded", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  localStorage.setItem("__auth_ref_ref_", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
  Update_loaded_(localStorage.getItem("loaded"))
}
function clear_storage(){
  if (window.confirm("Do you really want to leave?")) {
    window.localStorage.removeItem('__auth__token__');
    window.localStorage.removeItem('__token__');
    window.localStorage.removeItem('loaded');
    Update_loaded_(null)
    
  }else{ }
 }

function _load_nav_bar_(){
  if(setJwt === null)
  {
  return (<BrowserRouter>
	<Navbar  bg="light" expand="md" sticky="top">
	   <Nav><Link className="" to="/"><img src="/home.png" className="signature" alt='Opps something went wrong' widht='50px' height='50px;'/></Link></Nav>
	  <Navbar.Toggle aria-controls="basic-navbar-nav" />
	  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<Nav><Link  style={{"textDecoration": "none"}} className="hover_effect" to="/Portfolio"><span>Portfolio</span></Link></Nav>
	      <Nav><Link   style={{"textDecoration": "none"}} className="hover_effect" to="/login"><span>login</span></Link></Nav>
	      <Nav ><Link  style={{"textDecoration": "none"}} className="hover_effect"  to="/Signup"><span>Signup</span></Link></Nav>
        <Nav ><Link  style={{"textDecoration": "none"}} className="hover_effect"  onClick={clear_storage} to="#"><span>Switch off</span></Link></Nav>
        
	    </Nav>
	  </Navbar.Collapse>
	</Navbar>
		<Switch>
       <Route exact path="/">
           <Portfolio />
        </Route>
		    <Route exact path="/Portfolio">
           <Portfolio />
        </Route>
          <Route exact path="/login">
           <Login />
          </Route>
          <Route exact path="/Signup">
           	<Signup />
          </Route>
        </Switch>
</BrowserRouter>)

  }else
  {
    return (<BrowserRouter>
      <Navbar bg="light" expand="md" sticky="top">
         <Nav><Link className="" to="/Portfolio"><img className="avatar" src={_image_name_} alt='Opps something went wrong' widht='50px' height='50px;'/></Link></Nav>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<Nav><Link  className="hover_effect"  style={{"textDecoration": "none"}} className="hover_effect" to="/Portfolio"><span>Portfolio</span></Link></Nav>
            
           
               <Nav><Link  style={{"textDecoration": "none"}} className="hover_effect"  to="/Dashboard"><span>Dashboard</span></Link></Nav>
             
            <Nav ><Link  style={{"textDecoration": "none"}} className="hover_effect"  className="hover_effect"  to="/logout"><span>logout</span></Link></Nav>
            <Nav ><Link  style={{"textDecoration": "none"}} className="hover_effect"  className="hover_effect"  onClick={clear_storage} to="#"><span>Switch off</span></Link></Nav>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
        <Switch>
            <Route path="/Portfolio">
               <Portfolio />
            </Route>
    
            <Route path="/Dashboard">
               <Dashboard />
            </Route>
    
            <Route path="/logout">
               <Logout />
            </Route>
    
            </Switch>
        </BrowserRouter>)
  }

}
return (
 	<>
   {
   (_loaded_ === null)
    ? 
    <div className="monitor">
    <div className="screen">
      <div className="crt">
        <div className="terminal">
          <h1 className="letsgo">🙏🙏 Myself Roshan 🙏🙏 </h1>
        </div>
      </div>
      <button className="letgo_button" onClick={store_date}>Turn On</button>
    </div>
  </div>
  :
  _load_nav_bar_()
  }
 	</>
	);
};

export default Header_front;