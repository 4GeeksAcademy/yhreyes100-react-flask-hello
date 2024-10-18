import React, { useContext,useEffect,useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { useNavigate,Link } from "react-router-dom";
export const Users = () => {
	const { store, actions } = useContext(Context);
    const [users,setUsers]= useState([])
    const navigate = useNavigate()
    useEffect(()=>{
       const getUsers= async ()=>{
        const resp = await fetch("https://glowing-rotary-phone-vgw979jwpwphwr4x-3001.app.github.dev/users",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization":'Bearer '+ localStorage.getItem('jwt-token')
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.users)
           setUsers(data.users)
        })
        .catch(err => console.error(err));    
       
       }
       getUsers();
    },[])
	return (
		<>
        <div className="container-fluid justify-content-center">
        <h1>Users List</h1>    
        <ul className="list-group pull-down" id="contact-list">
					{
					users!=null?	
					users.map((user,index)=>(
						<li className="list-group-item" key={index}>{user.username}</li>
					)):""
					}
        </ul>
        <Link className="mt-3 w-100 text-center" to="/">Back Home</Link>
        </div>
        </>
	);
};
