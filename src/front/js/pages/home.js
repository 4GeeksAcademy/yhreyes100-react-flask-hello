import React, { useContext,useState } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";
import { useNavigate,Link } from "react-router-dom";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const [username,setUser]=useState("")
    const [password,setPassword]=useState("")
    const navigate = useNavigate();
	const Login = () =>{
        fetch("https://glowing-rotary-phone-vgw979jwpwphwr4x-3001.app.github.dev/login",{
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
            localStorage.setItem("jwt-token",data.token)
            navigate("/users") 
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
                    <input type="text" name="userName"
					onChange={(e)=>{setUser(e.target.value)}}
					id="userName" placeholder="Username" />
                </div>
                <div className="form-field d-flex align-items-center">
                    <span className="fas fa-key"></span>
                    <input type="password" 
					onChange={(e)=>{setPassword(e.target.value)}}
					name="password" id="pwd" placeholder="Password" />
                </div>
                <b className="btn mt-3" onClick={()=>Login()}>Login</b>
            </div>
            <div className="text-center fs-6">
            <Link to="/singup">Singup</Link>
            </div>
        </div>
	);
};
