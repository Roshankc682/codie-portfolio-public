import React from "react";
import Header_front from "./components/Header_front";
import VerfiyEmail from "./components/VerfiyEmail";
// import VerfiyEmailUpdate from "./components/VerfiyEmail";


function App() {

  let url = new URL(window.location);
  let searchParams = new URLSearchParams(url.search);
  console.log(searchParams.get('token'));
  
  try{
    const n = searchParams.get('token').length
    if(n <=10 )
    {
        alert("!!! Try Harder !!! ")
        window.location.replace("/");

    }
  }
  catch{

  }
  

  if(searchParams.get('token'))
  {
    localStorage.setItem("loaded", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

  }else{}
  
  return (
   <>
   {
   (searchParams.get('token'))
   ?
   <VerfiyEmail />
   :
   <div>
     
    <Header_front />
       
  </div>
  }
   </>
  );
}
export default App;
