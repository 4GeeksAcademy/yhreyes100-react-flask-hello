import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate,Link } from "react-router-dom";

export const Singup = () => {
	const { store, actions } = useContext(Context);
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const navigate = useNavigate();
    const singup = ()=>{
        fetch('https://glowing-rotary-phone-vgw979jwpwphwr4x-3001.app.github.dev/user',{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({"username":username,"password": password}),
          })
          .then(resp => {
              return resp.json();
          })
          .then(data => {
           navigate('/')
          })
          .catch(error => {
              console.log(error);
          });
    }
	return (
		<div className="wrapper">
            <div className="logo">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_NApT35W-2Ghuoc2INZFCREowZC7b99XBnw&s" alt="" />
            </div>
            <div className="text-center mt-4 name">
                4Geeks
            </div>
            <div className="p-3 mt-3">
                <div className="form-field d-flex align-items-center">
                    <span className="far fa-user"></span>
                    <input type="text" 
                    onChange={(e)=>{setUsername(e.target.value)}}
                     name="userName" id="userName" placeholder="Username" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="password"
                    onChange={(e)=>{setPassword(e.target.value)}}
                    name="password" id="pwd" placeholder="Password" />
                </div>
                <b className="btn mt-3" onClick={()=>singup()} >Registrer</b>
            </div>
            <div className="text-center fs-6">
            <Link to="/">Login</Link>
            </div>
        </div>
	);
};
