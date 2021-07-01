import React , { useEffect, useState } from "react";
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert , Form , Button } from 'react-bootstrap';
import './Form.css';
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {


// const backend_url = "https://api-v1-backend.herokuapp.com";
const backend_url = "http://localhost:8000";
const [setresponse, Updatesetresponse] = useState("");
const [errorsetresponse, Updateerrorsetresponse] = useState("");
const [_reset_recapcha_, Update_reset_recapcha_] = useState(null);
const recaptchaRef = React.createRef();



const recaptchaRef_forgot_pass = React.createRef();
const [passwordresetgood, Uppasswordresetgood] = useState(null);
const [passwordreseterrror, Uppasswordreseterrror] = useState(null);



	 const handleSubmit = (evt) => {
      evt.preventDefault();
      const firstname = evt.target.elements.firstname.value;
   	  const lastname = evt.target.elements.lastname.value;
      const email = evt.target.elements.email.value;
	  const password = evt.target.elements.password.value;
	  const _pass_value_ = evt.target.elements._pass_value_.value;
	  const recaptchaValue = recaptchaRef.current.getValue();
	  	
	  if(firstname === "" || lastname === "" || email === "" || password === "")
	  {	
		  
		  Updateerrorsetresponse("Empty fields")
		  return
	  }
	  const n = password.length;
	  if(n <= 5)
	  {
		  Updateerrorsetresponse("Password must be at least five character")
		  return
	  }

	     axios.post(backend_url+'/register/',{
		      first_name:firstname,
		      last_name:lastname,
		      email:email,
			  password:password,
			  __key__id__ : _pass_value_,
			  recapcha : recaptchaValue
		    })
		    .then((response) => {
			     // console.log(response.data.message)
			     	try{
						// if(response.data.message)
						// {
							Updateerrorsetresponse(null);
							Updatesetresponse(response.data.message);
						// }
						evt.target.elements.firstname.value = '';
						evt.target.elements.lastname.value = '';
						evt.target.elements.email.value = '';
						evt.target.elements.password.value = '';
					 }catch(e){
							
						Updatesetresponse("something went wrong");
					 }
			    })
			    .catch(err =>{
				try{
					if(err.response.data.message)
						{
							Updatesetresponse(null);
							Updateerrorsetresponse(err.response.data.message)
						}
				}catch(e){
					Updateerrorsetresponse(null);	
					Updateerrorsetresponse("something went wrong");
				 }
				}).finally(() => {
					try{
						Update_reset_recapcha_(Math.floor(Math.random() * 101))
						const button = document.getElementById("hide_first")
						button.disabled = true
						button.classList.remove("btn-primary");
						document.getElementById("hide_first").classList.add('btn-secondary');
					}catch(e){
						Updateerrorsetresponse("something went wrong");
					}
				  });
	 } 
function onChange(value) {
   const button = document.getElementById("hide_first")
   button.classList.remove("btn-secondary");
   button.disabled = false
   document.getElementById("hide_first").classList.add('btn-primary');
//    console.log(value)
}

useEffect(() => {const recaptchaValue = recaptchaRef.current.reset();},[_reset_recapcha_]);


   
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
	 <div className="center_div_all shadow-lg p-3 mb-5 bg-white rounded">
	
 	<div className="Form_div"  id="signup_tag">
	 {setresponse?<Alert variant="success">{setresponse}</Alert>:null} 
 	{errorsetresponse?<Alert variant="danger">{errorsetresponse}</Alert>:null} 
	  <center><Form.Label><b>Sign-Up</b></Form.Label></center>

  		<Form onSubmit={handleSubmit}>

		  <Form.Group controlId="firstname">
		 
		    <Form.Label>First Name</Form.Label>
		    <Form.Control name="firstname" type="text" placeholder="Enter First name" required/>
		  </Form.Group>

		  <Form.Group controlId="lastname">
		    <Form.Label>last Name</Form.Label>
		    <Form.Control  name="lastname" type="text" placeholder="Enter last name" required/>
		  </Form.Group>

		   <Form.Group controlId="email">
		    <Form.Label>Email address</Form.Label>
		    <Form.Control  name="email" type="email" placeholder="Enter email" required/>
		  </Form.Group>
		  <Form.Group controlId="password">
		    <Form.Label>Password</Form.Label>
		    <Form.Control  name="password" type="password" placeholder="Password" required/>
		  </Form.Group>
		  <div className="alert alert-warning" role="alert">
			Solve capcha to enable Register button
		  </div>
		  <ReCAPTCHA ref={recaptchaRef} sitekey="" onChange={onChange}/>
		  <input type="hidden" defaultValue={Math.floor(Math.random() * 101)} name="_pass_value_"/><br/>
		  
		  {/* <Button id="hide_first" className="btn btn-secondary" variant="primary" type="submit"  > */}
		  <Button id="hide_first" className="btn btn-secondary btn-lg btn-block" variant="primary" type="submit" disabled >
		    Register
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
 	</>
	);
};
export default Signup;