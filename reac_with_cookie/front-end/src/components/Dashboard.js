import React , { useState , useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import {Spinner ,  Form , Button } from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha";

const Dashboard = () => {

  // const backend_url = "https://api-v1-backend.herokuapp.com";
  const backend_url = "http://localhost:8000";
  const [setJwt, UpdatesetJwt] = useState(null);
  const [errorpass, Updateerrorpass] = useState(null);
  const [passUpdate, UpdatepassUpdate] = useState(null);
  const [erroremail, Updateerroremail] = useState(null);
  const [updateemail, Updateupdateemail] = useState(null);
  const recaptchaRef = React.createRef();


  useEffect(() => {
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


const Change_pass = (evt) => {
        evt.preventDefault();
        const pass = evt.target.elements.pass.value;
        const n = pass.length;
        
        if(n <= 5)
        {
          Updateerrorpass("Password must be 5 character long")
          Updateerroremail(null)
          Updateupdateemail(null)
          return
        }
        axios.post(backend_url+'/api/_update_/password/',{
          'pass': pass,
        },{ headers: {'Authorization': `Bearer ${setJwt}` }})
        .then((response) => {
            try{
              UpdatepassUpdate(response.data["message"])
              Updateerrorpass(null)
              Updateerroremail(null)
              Updateupdateemail(null)
            }catch(e){
              Updateerrorpass("Something went wrong")
              Updateerroremail(null)
              Updateerrorpass(null)
              Updateupdateemail(null)
            }
            })
          .catch(err =>{
              try{
                Updateerrorpass("Something went wrong")
                Updateerroremail(null)
                Updateupdateemail(null)
              }catch(e){
                Updateerrorpass("Something went wrong")
                Updateerroremail(null)
                Updateupdateemail(null)
              }
           });

  
}


const Change_Email = (evt) => {
  evt.preventDefault();
  const email = evt.target.elements.email.value;
  const recaptchaValue = recaptchaRef.current.getValue();
  axios.post(backend_url+'/api/_update_/email/',{
    'email': email,
    recapcha : recaptchaValue,
  },{ headers: {'Authorization': `Bearer ${setJwt}` }})
  .then((response) => {
    const recaptchaValue = recaptchaRef.current.reset();
      try{
        Updateupdateemail(response.data["message"])
        Updateerrorpass(null)
        Updateerroremail(null)
        UpdatepassUpdate(null)
      }catch(e){
        Updateerrorpass(null)
        Updateerroremail(null)
        UpdatepassUpdate(null)
      }
      })
    .catch(err =>{
        const recaptchaValue = recaptchaRef.current.reset();
        try{
          Updateerroremail(err.response.data.message)
          Updateerrorpass(null)
          UpdatepassUpdate(null)
          Updateupdateemail(null)

        }catch(e){
          Updateerroremail("Something went wrong")
          Updateerrorpass(null)
          UpdatepassUpdate(null)
          Updateupdateemail(null)
          const button = document.getElementById("hide_first")
          button.disabled = true
          button.classList.remove("btn-primary");
          document.getElementById("hide_first").classList.add('btn-secondary');
        }
      }).finally(() => {
        
        try{
          const recaptchaValue = recaptchaRef.current.reset();
          const button = document.getElementById("hide_first")
          button.disabled = true
          button.classList.remove("btn-primary");
          document.getElementById("hide_first").classList.add('btn-secondary');
        }catch(e){
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


return (
  <>
   {
  (setJwt === null)
  ? 
  
  <center>
    <div className="alert_center">
        <Spinner animation="grow" variant="success" />
    </div>
    </center>

  :
  
  <div className="center_dashboard shadow p-5 bg-white rounded">

    <div className="flex_container_dashboard">
      {/* ====================================================================== */}
      <div className="dashboard_div">
                <Form onSubmit={Change_Email}>
                    <div className="form-group">
                    <p style={{"color":"red"}} className="size" >{erroremail}</p>
                    <p style={{"color":"green"}} className="size" >{updateemail}</p>
                      <label htmlFor="exampleInputEmail1">Change E-mail</label>
                      <input type="email" className="form-control" name="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter New email" required/>
                      </div>
                      <ReCAPTCHA ref={recaptchaRef} sitekey="6LdjEeQaAAAAACb7HVp1MdIdTR_VbgRqO7hRqUjK" onChange={onChange}/>
		                  <Button id="hide_first" type="submit" variant="dark" disabled>Change E-mail</Button>
                </Form>
          </div>

          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;

           <div className="dashboard_div">
           <Form onSubmit={Change_pass}>
            <div className="form-group">
            
            <p style={{"color":"red"}} className="size" >{errorpass}</p>
            <p style={{"color":"green"}} className="size">{passUpdate}</p>
           
              <label htmlFor="exampleInputPassword1">Change Password</label>
              <input type="password" name="pass" className="form-control" id="exampleInputPassword1" placeholder="New Password" required/>
            </div>
          
          <Button type="submit" variant="dark">Change password</Button>
          </Form>
          </div>
          
          
      {/* ====================================================================== */}
    </div>


  </div>

   }

  </>
  );
};

export default Dashboard;