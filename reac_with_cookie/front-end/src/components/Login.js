import React , { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner , Alert, Form , Button } from 'react-bootstrap';
import './Form.css';
import axios from 'axios'
import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  // const backend_url = "https://api-v1-backend.herokuapp.com";
  const backend_url = "http://localhost:8000";
  const [errorsetresponse, Updateerrorsetresponse] = useState(null);
  const [setJwt, UpdatesetJwt] = useState(null);
  // const [_reset_recapcha_, Update_reset_recapcha_] = useState(null);
  const recaptchaRef = React.createRef();

  const recaptchaRef_forgot_pass = React.createRef();
  
  const [passwordresetgood, Uppasswordresetgood] = useState(null);
  const [passwordreseterrror, Uppasswordreseterrror] = useState(null);

  const loginsubmit = (evt) => {
      evt.preventDefault();
      const email = evt.target.elements.email.value;
      const password = evt.target.elements.password.value;
      const recaptchaValue = recaptchaRef.current.getValue();
     
      const _pass_value_ = evt.target.elements._pass_value_.value;
          if(email === "" || password === "")
          { 
            Updateerrorsetresponse("Empty fields")
            return
          }
          
          const n = password.length;
          if(n <= 5)
          {
            Updateerrorsetresponse("Please input a valid password")
            return
          }
        axios.post(backend_url+'/api/token/',{
          email:email,
          password:password,
          __key__id__ : _pass_value_,
          recapcha : recaptchaValue,
          url:backend_url+"/api/token/"
        }, { withCredentials: true })
        .then((response) => {
          try{
            
             Updateerrorsetresponse(null)
             UpdatesetJwt(response.data["access"]);
             // console.log(response.data["access"])
             window.location.href = '/Portfolio';
          }catch(e){
           
            Updateerrorsetresponse("something went wrong")
          }
          })
          .catch(err =>{
            
           // console.log(err.response.data.detail)
           try{
           UpdatesetJwt(null);
           
           Updateerrorsetresponse(err.response.data.detail)
          }catch(e){
            
            Updateerrorsetresponse("something went wrong")
          }
           
          }).finally(() => {
            try{
              const recaptchaValue = recaptchaRef.current.reset();
              const button = document.getElementById("hide_first")
              button.disabled = true
              button.classList.remove("btn-primary");
              document.getElementById("hide_first").classList.add('btn-secondary');
            }catch(e){
              // Updateerrorsetresponse("something went wrong")
            }
            
            });

    }

    function onChange(value) {
      const button = document.getElementById("hide_first")
      button.classList.remove("btn-secondary");
      button.disabled = false
      document.getElementById("hide_first").classList.add('btn-primary');
      // console.log(value)
   }  
 
   
   const _activate_reset_ = (evt) => {
    // console.log("_reset_activated_") 
    const signup_div = document.getElementById("signup_tag");
    const hide_signup_tag = document.getElementById("hide_signup_tag");
    const password_reset = document.getElementById("password_reset");
    
        if (signup_div.style.display !== "none")
        {
          signup_div.style.display = "none";
          hide_signup_tag.style.display = "none";
          password_reset.style.display = "block";
        }
    }
    
    const _deactivate_reset_ = (evt) => {
      // console.log("_reset_deactivated_")
      const signup_div = document.getElementById("signup_tag");
      const hide_signup_tag = document.getElementById("hide_signup_tag");
      const password_reset = document.getElementById("password_reset");
      
          if (signup_div.style.display !== "block")
          {
            signup_div.style.display = "block";
            hide_signup_tag.style.display = "block";
            password_reset.style.display = "none";
            
          }
    }


function disable_reset(value) {
  const button = document.getElementById("reset_hide_first")
  button.disabled = false
  document.getElementById("hide_first").classList.add('btn-primary');
  // console.log(value)
}

const _send_email_ = (evt) => {
  evt.preventDefault();
  const new_email = evt.target.elements.new_email.value;
  const recaptchaValue = recaptchaRef_forgot_pass.current.getValue();
  // console.log(recaptchaValue)
  // return
  axios.post(backend_url+'/api/_send_mail_/_reset_pass_/',{
    email:new_email,
    recapcha : recaptchaValue,
  })
  .then((response) => {
    try{
      const recaptchaValue = recaptchaRef_forgot_pass.current.reset();
      Uppasswordresetgood(response.data["message"])
      Uppasswordreseterrror(null)
    }catch(e){
      Uppasswordresetgood(null)
      Uppasswordreseterrror("something went wrong")
    }
    })
    .catch(err =>{
      
     try{
      const recaptchaValue = recaptchaRef_forgot_pass.current.reset();
      Uppasswordresetgood(null)
      Uppasswordreseterrror(err.response.data.message)
    
    }catch(e){
      
      Uppasswordresetgood(null)
      Uppasswordreseterrror("something went wrong")
    }
     
    }).finally(() => {
      try{
        const recaptchaValue = recaptchaRef_forgot_pass.current.reset();
        // const button = document.getElementById("reset_hide_first")
        // button.disabled = true
      }catch(e){
        // Updateerrorsetresponse("something went wrong")
      }
      
      });
}

return (
  <>
  {
  (setJwt === null)
  ? 
  <div className="center_div_all shadow-lg p-3 mb-5 bg-white rounded">
    <center><div className="alert_center">{errorsetresponse?<Alert variant="danger">{errorsetresponse}</Alert>: null}
  </div></center>


  <div className="Form_div" id="signup_tag">
  <center><Form.Label><b>Login</b></Form.Label></center>
      <Form onSubmit={loginsubmit}>
      
       <Form.Group controlId="formBasicEmail">
       
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" name="email" placeholder="Enter email" required/>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" name="password" placeholder="Password" required/>
      </Form.Group>
      <div className="alert alert-warning" role="alert">
			Solve capcha to enable login button
		  </div>
		  <ReCAPTCHA ref={recaptchaRef} sitekey="" onChange={onChange}/>
		  <input type="hidden" defaultValue={Math.floor(Math.random() * 101)} name="_pass_value_"/><br/>

      <Button id="hide_first" className="btn btn-secondary btn-lg btn-block" variant="primary" type="submit" disabled>
      {/* <Button id="hide_first" className="btn btn-secondary" variant="primary" type="submit" > */}
        Login
      </Button>
      </Form>
      <br></br>
      
      <Button onClick={_activate_reset_} id="hide_signup_tag" className="btn-lg btn-block" variant="danger" >Reset Password</Button> 

      </div>


      {/* ================reset password form=============== */}
     
      <div className="Form_div" id="password_reset">
        <center><Form.Label><b>Reset password</b></Form.Label></center>
        <center>{passwordreseterrror?<Alert variant="danger">{passwordreseterrror}</Alert>: null}
      {passwordresetgood?<Alert variant="primary">{passwordresetgood}</Alert>: null}</center>
          <Form onSubmit={_send_email_}>
          <Form.Group controlId="formBasicEmai">
            <Form.Label>Enter New Email</Form.Label>
          <Form.Control type="email" name="new_email" placeholder="Enter email" required/>
            </Form.Group>
            <div className="alert alert-warning" role="alert">
                Solve capcha to enable reset button
            </div>
          <ReCAPTCHA ref={recaptchaRef_forgot_pass} sitekey="" onChange={disable_reset}/>
          <Button id="reset_hide_first" type="submit" className="btn-lg btn-block" variant="danger" disabled>Reset Password</Button>
          {/* <Button id="" type="submit" className="btn-lg btn-block" variant="danger" >Reset Password</Button> */}
          <Button onClick={_deactivate_reset_} className="btn-lg btn-block" variant="warning">Back</Button>
          </Form>
      </div>
       {/* ================reset password form=============== */}

      </div>
    :
    <div className="alert_center"><Alert variant="success">You are login wait for second<br></br>
     <center>
    <div className="alert_center">
        <Spinner animation="grow" variant="success" />
    </div>
    </center></Alert></div>
  
}
  </>
  );
};

export default Login;