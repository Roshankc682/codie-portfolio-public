import React , { useState , useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import axios from 'axios'
import {Card, Alert,ProgressBar } from 'react-bootstrap';
import ScrollToTopbtn1 from "./ScrollToTop";



const Home = () => {


  // const backend_url = "https://api-v1-backend.herokuapp.com";
  const backend_url = "http://localhost:8000";
  const [setJwt, UpdatesetJwt] = useState(null);

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

const h2style = {fontSize: '15px',width:'45%'};

return (
  <>
  {/* <div className="center_div_all_home shadow-lg p-3 mb-5 bg-white rounded"> */}

  {/* ============================================================================== */}
  <div className="center_div_all_home shadow-lg p-3 mb-5 bg-white rounded">
  <header className="header-icons overlay">
                    <div className="background-image-holder parallax-background">
                        <img className="image background-image" alt="Background Image" src="50570772_838309843180062_8540010755439722496_n.jpg"/>
                    </div>
                    
                    <div className="container">

                    {(setJwt?null:<center><h2  style={h2style}><b><Alert variant="info">!!! I would appreciate if you visit site logging in !!!!</Alert></b></h2></center>)}

                        <div className="row">
                            <div className="col-sm-12">
                                <center><h1 className="text-white">
                                    Hello, I'm Roshan Kc.<br></br>I can &nbsp;<span>create decent site with awsome BackEnd</span>&nbsp;for you.</h1>
                                </center>
                            </div>
                        </div>
                        
                       </div>  
             </header>

    
    <section className="skill-bars">
        
        <div className="container">
            <div className="row">
                <div className="col-md-11 col-md-offset-2 col-sm-10 col-sm-offset-1 text-center">
                  <h1>&nbsp;&nbsp;My skills</h1>
                </div>
            </div>
            <ScrollToTopbtn1 />
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="skills-left skills">
                        <h3>😀 Developing</h3>
                        <ul className="skills-ul">
                           
                            <li>
                                <span>HTML &amp; CSS3</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={70} />
                                </div>
                            </li>
                            <li>
                                <span>python</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={80} />
                                </div>
                            </li>
                            <li>
                                <span>Django</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={80} />
                                </div>
                            </li>
                            <li>
                                <span>React</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={60} />
                                </div>
                            </li>
                            <li>
                                <span>Javascript</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={80} />
                                </div>
                            </li>
                            <li>
                                <span>PHP &amp; MySQL</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={85} />
                                </div>
                            </li>
                            <li>
                                <span>Java</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={80} />
                                </div>
                            </li>
                            <li>
                                <span>DotNet</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={50} />
                                </div>
                            </li>
                            <li>
                                <span>WordPress</span>
                                <div className="skill-bar-holder">
                                <ProgressBar variant="primary" now={50} />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="col-md-6 col-sm-12">
                    <div className="skills-right skills">
                        <h3>Design 😀</h3>
                        <ul className="skills-ul">
                        <li>
                                <span>Web Design</span>
                                <div className="skill-bar-holder">
                                       <ProgressBar variant="primary" now={50} />
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>


<section className="no-pad-bottom projects-gallery">
<ScrollToTopbtn1 />
    <div className="container">
          <div className="row">
            <div className="col-md-11 col-md-offset-3 col-sm-8 col-sm-offset-2 text-center">
              <h1>Check out my  projects</h1>
              <p className="lead">
                {/* test */}
              </p>
            </div>
          </div>
        </div>
        <div className="projects-wrapper clearfix">
        {/* <!-- ====================================================================== --> */}
        
        <div className="projects-container">

        <div className="image-container">

        <div className="second col-md-5 col-sm-10 no-pad project development image-holder">
              <div className="background-image-holder">
                <img className="background-image" alt="Background Image" src="https://media.istockphoto.com/photos/books-stacked-on-table-at-bookstore-picture-id120004828?k=6&m=120004828&s=612x612&w=0&h=oRp9_Qa5PZ3BTIH-_6Ihfq80SQ0BjNz2LpIkkc5yRDs="/>
              </div>
              <div className="hover-state">
                <div className="align-vertical">
                  <h1 className="text-white"><strong>First semester Project</strong></h1>
                  <p className="text-white">Develope Using Php mysql Html css Bootstrap and required library ..</p>
                  <a href="https://github.com/Roshankc682/Book_Store" target="_blank" className="btn1 btn1-primary btn1-white">Github/BookStore</a>
                </div>
              </div>
            </div>    
            <div className="second col-md-5 col-sm-10 no-pad project development image-holder">
              <div className="background-image-holder">
                <img className="background-image" alt="Background Image" src="https://i.ytimg.com/vi/PUzgZrS_piQ/maxresdefault.jpg"/>
              </div>
              <div className="hover-state">
                <div className="align-vertical">
                  <h1 className="text-white"><strong>Django JWT implementation with set-cookie</strong></h1>
                  <p className="text-white">This was the most fun project </p>
                  <a href="https://github.com/Roshankc682/Django_Set_cookie_with_JWT_Implemetation" target="_blank" className="btn1 btn1-primary btn1-white">Github/DjangoJwt</a>
                </div>
              </div>
            </div>    
            
            <div className="second col-md-5 col-sm-10 no-pad project development image-holder">
              <div className="background-image-holder">
                <img className="background-image" alt="Background Image" src="https://lh3.googleusercontent.com/0kA7McyfV-z67weym9fe0myv4HJmayCPt7Jh5ZaN4qBemvKlroK4JKlvzj_bJFwxUp-u1mNhy5uQ2AxYbjN2oolyag=w640-h400-e365-rj-sc0x00ffffff"/>
              </div>
              <div className="hover-state">
                <div className="align-vertical">
                  <h1 className="text-white"><strong>Personal project To-do-List</strong></h1>
                  <p className="text-white">I forget things mostly so created a list extension form js you can get it from google extension also</p>
                  <a href="https://github.com/Roshankc682/To-do_-List" target="_blank" className="btn1 btn1-primary btn1-white">Github/ToDoList</a>
                  <h1 className="text-white"><strong>From Google extension </strong></h1>
  
                  <a href="https://chrome.google.com/webstore/detail/to-do-list/kcfhljenkbhelpfophfokmcbahjcllai" target="_blank" className="btn1 btn1-primary btn1-white">Google/ToDoList</a>
                </div>
              </div>
            </div>    

            <div className="second col-md-5 col-sm-10 no-pad project development image-holder">
              <div className="background-image-holder">
                <img className="background-image" alt="Background Image" src="https://www.valentinog.com/blog/static/92f4119867bbe5ae6f5320b2e207cfd7/c1b63/django-rest-framework-with-react.png"/>
              </div>
              <div className="hover-state">
                <div className="align-vertical">
                  <h1 className="text-white"><strong>React WebApp for FrontEnd</strong></h1>
                  <p className="text-white">Implementation for front end for django JWT token authentication</p>
                  <a href="https://github.com/Roshankc682/react_set_cookie" target="_blank" className="btn1 btn1-primary btn1-white">Github/ReactSetCookie</a>
                </div>
              </div>
            </div>  

            <div className="second col-md-5 col-sm-10 no-pad project development image-holder">
              <div className="background-image-holder">
                <img className="background-image" alt="Background Image" src="https://csharpcorner-mindcrackerinc.netdna-ssl.com/article/json-serialization-and-deserialization-in-c-sharp/Images/1.png"/>
              </div>
              <div className="hover-state">
                <div className="align-vertical">
                  <h1 className="text-white"><strong>Json is Awsome </strong></h1>
                  <p className="text-white">Simple JS project that take input and store in localstorage and can edit update in form of JSON </p>
                  <a href="https://github.com/Roshankc682/json-is-awsum" target="_blank" className="btn1 btn1-primary btn1-white">Github/JSON-Awsum</a>
                </div>
              </div>
            </div>  

            </div>
          </div>  
          {/* <!-- ====================================================================== --> */}
          </div>
      </section>
  </div>
  {/* </div> */}
   

    {/* =========================================================================================== */}
    <section>
    <ScrollToTopbtn1 />
    <div className="footer-container">
		<footer className="bg-primary short-2">
				<div className="container">
					<div className="row">
						<div className="col-sm-12 text-center">
							<span className="text-white">💗 😍 😄  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;© 2014 Roshan kc - All Rights Reserved<a href="#Roshan_____Kc#">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;😄 😍 💗</a></span>
							<br></br>
							<br></br>
							<i className="icon text-white icon_mail"></i>
							<a href="contact.html" className="text-white"><span className="text-white"> Get in touch with me <i className="icon arrow_right"></i></span></a>
						</div>
					</div>
				</div>
				
			</footer>
		</div>
    </section>
  {/* ============================================================================== */}
  
  </>
  );
};

export default Home;