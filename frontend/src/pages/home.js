import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate=useNavigate();
  const location = useLocation();
  const userstate = location.state;
  
  const userdata=userstate.userData;

  function handleclick(i){
   navigate(`/${i}`, { state: { userData:userdata} });
  }

  return (
    (
      <div>
        <h1>hello user {userdata.email} </h1>
        <h1>Welcome to the Homepage</h1>
       
        <button onClick={()=>handleclick("chats")}>chats</button>
        <button onClick={()=>handleclick("signup")}>signup</button>
        <button onClick={()=>handleclick("maps")}>maps</button>
        <button onClick={()=>handleclick("posts")}>posts</button>
        <button onClick={()=>handleclick("announcements")}>announcements</button>
        <button onClick={()=>handleclick("viewmarkers")}>viewmarkers</button>
      </div>
    )
  );
}

export default Home;
