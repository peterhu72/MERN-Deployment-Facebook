import React from 'react';
import { useNavigate, Link} from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {

    const navigate = useNavigate()

    const profile = () => {
        navigate("/profile")
    }

    const logout = () =>{
        axios.get("http://localhost:8000/api/users/logout", {withCredentials: true})
            .then(res =>{
                navigate("/")
            })
            .catch(err=> console.log(err))
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light bd-btn">
            <div className="container">
                <h1 className='text-dark'>Facebook</h1>
                <button className="btn btn-info" onClick={profile}>Profile</button>
                <button className='btn btn-info' onClick={logout}>Logout</button>
                <Link to="/menu"><img src="https://cdn-icons-png.flaticon.com/512/25/25694.png" alt="" className="sml-img" /></Link>
            </div>
            
        </nav>
    );
};

export default NavBar;