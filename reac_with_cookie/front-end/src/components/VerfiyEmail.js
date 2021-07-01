import React , { useState , useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import {Spinner ,Button } from 'react-bootstrap';
import { Form , Alert } from 'react-bootstrap';
// import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';
import DOMPurify from 'dompurify';

const VerfiyEmail = () => {

  // const backend_url = "https://api-v1-backend.herokuapp.com";
  const backend_url = "http://localhost:8000"
  const front_end_url = "http://localhost:3000"
  
  
  
  const [load_element, u_load_element] = useState(null);
  const [form_check_email, U_form_check_email] = useState(null);
  const [errorsetresponse, Updateerrorsetresponse] = useState(null);
  const [setresponse, Updatesetresponse] = useState(null);
  const [email, Updateemail] = useState(null);
  const [Spinner_true, UpdateSpinner_true] = useState(null);
  const [successsetresponse_pass, U_successsetresponse_pass] = useState(null);
  

  
  const [errorsetresponse_pass, U_errorsetresponse_pass] = useState(null);
  const [token_reset, U_token_reset] = useState(null);
  
  useEffect(() => {
    let url = new URL(window.location);
    let searchParams = new URLSearchParams(url.search);
    
    const _imp_ = Math.floor(Math.random() * 3852)
    const __imp__ = Math.floor(Math.random() * 8985)
    const ___imp__ = Math.floor(Math.random() * 4586)
    const ___imp___ = Math.floor(Math.random() * 2352)

    if(searchParams.get('type') === null){
      U_form_check_email("load_text")
      axios.post(backend_url+'/api/__email___verify__/',
    {
        token:searchParams.get('token'),
        _imp_:_imp_,
        __imp__:__imp__,
        ___imp__:___imp__,
        ___imp___:___imp___,
    })
        .then((response) => {
            try{
                Updatesetresponse(response.data["message"]);
                Updateemail(response.data["email"]);
             }catch(e){
               Updateerrorsetresponse("something went wrong")
             }
            })
            .catch(err =>{
             try{
             Updateerrorsetresponse(err.response.data.message)
            }catch(e){
              Updateerrorsetresponse("something went wrong")
            }
             
            }).finally(() => {
              try{
                UpdateSpinner_true("_yerp_yerp_exit_spinner_")
              }catch(e){
              }
              
              });

    }
  
    if(searchParams.get('type') === "update"){
      U_form_check_email("load_text")
    axios.post(backend_url+'/api/__email___update__/',
    {
        token:searchParams.get('token'),
        type:searchParams.get('type'),
        _imp_:_imp_,
        __imp__:__imp__,
        ___imp__:___imp__,
        ___imp___:___imp___,
    })
        .then((response) => {
            try{
                Updatesetresponse(response.data["message"]);
                Updateemail(response.data["email"]);
             }catch(e){
               Updateerrorsetresponse("something went wrong")
             }
            })
            .catch(err =>{
             try{
             Updateerrorsetresponse(err.response.data.message)
            }catch(e){
              Updateerrorsetresponse("something went wrong")
            }
             
            }).finally(() => {
              try{
                UpdateSpinner_true("_yerp_yerp_exit_spinner_")
              }catch(e){
              }
              
              });
    }
  

    if(searchParams.get('type') === "reset"){
      UpdateSpinner_true("_yerp_yerp_exit_spinner_")
      u_load_element('_Load_Element')
      U_token_reset(searchParams.get('token'))
    }
},[]);
  
const Change_pass = (evt) => {
  evt.preventDefault();
  
  const password_confirm = evt.target.elements.password_confirm.value;
  const password = evt.target.elements.password.value;
  var same_or_not = password.localeCompare(password);

  const n = password.length;
  const n1 = password_confirm.length;
  if(n <= 5)
  {
    U_errorsetresponse_pass("Password must be at least five character")
    U_successsetresponse_pass(null)
    return
  }
  if(n1 <= 5)
  {
    U_errorsetresponse_pass("Password must be at least five character")
    U_successsetresponse_pass(null)
    return
  }

  if(same_or_not===0)
  {
    // good
    U_errorsetresponse_pass(null)
    U_successsetresponse_pass(null)
  }else{
  
    U_errorsetresponse_pass("New and confirm password must match !!")
    return
  }
  axios.post(backend_url+'/api/______/_reset_pass_/',{
    'token_reset': token_reset,
    'password': password,
    'password_confirm': password_confirm,
  })
  .then((response) => {
    
      try{
       U_successsetresponse_pass(response.data["message"])
       U_errorsetresponse_pass(null)
      }catch(e){
        U_errorsetresponse_pass(null)
      }
      })
    .catch(err =>{
       
        try{
          U_errorsetresponse_pass(err.response.data.message)
          U_successsetresponse_pass(null)
        }catch(e){
          U_successsetresponse_pass(null)
        }
      }).finally(() => {
        });
}



return (
  <>   

  {form_check_email?
  <div>
    <center><h3><b>Wait for E-mail Validation Process ....</b></h3></center>
  </div>
 :
    null
  }
    <div className="center_div_all shadow-lg p-3 mb-5 bg-white rounded">
    {Spinner_true?
        null
    :
    <center>
    <div className="alert_center">
        <Spinner animation="grow" variant="success" />
    </div>
    </center>
    }
    <center><div className="alert_center">{errorsetresponse?
    <div>
        <Alert variant="danger">{errorsetresponse}</Alert><br></br><br></br>
        <a href={front_end_url+'/Signup'} className="signup_button">Go to Signup</a>
    </div>
    :
    null
     }
    </div></center>

     
          <center><div className="alert_center">{setresponse?
            <Alert variant="primary">{setresponse}{email}
            </Alert>    
            : null}</div></center>
        


            <center><div className="alert_center">{setresponse?
             <a href={front_end_url+'/login'} className="signup_button">Go to login</a>
            : null}
            </div>
          </center>
        

      {errorsetresponse_pass?
      <center><Alert variant="danger">{errorsetresponse_pass}</Alert></center>
      :
      null
      }
       {successsetresponse_pass?
      <center><Alert variant="info">{successsetresponse_pass}</Alert></center>
      :
      null
      }
      {load_element?
      <div>
       <center><Form.Label><b>Reset password</b></Form.Label></center>
        <Form onSubmit={Change_pass}>

        <Form.Group controlId="formBasicPassword1">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="Password" required/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword2">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control type="password" name="password_confirm" placeholder="Password" required/>
            </Form.Group>
            <input type="hidden" defaultValue={DOMPurify.sanitize(token_reset)} name="token" />

            <Button id="pass_pass" type="submit" className="btn-lg btn-block" variant="danger" >Reset Password</Button>
            
            <a href={front_end_url+'/login'} className="go_white btn-lg btn-block signup_button_reset">Go to login</a>
            
       </Form>
       </div>
      :
      <center>
    
    </center>
      }
    </div>
  </>
  );
};

export default VerfiyEmail;