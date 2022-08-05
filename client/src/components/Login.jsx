import React, {useState} from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Login = () => {

    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")

    let [formErrors, setFormErrors] = useState("")

    const navigate = useNavigate()

    const login = (e)=>{
        e.preventDefault()
        
        let form = {email, password}
        axios.post("http://localhost:8000/api/users/login", form, {withCredentials: true})
            .then(res => {
                console.log(res)
                if (res.data.error){
                    setFormErrors(res.data.error)
                } else {
                    navigate("/menu")
                }
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div className='register-card'>
            <h2>Login</h2>
            <form onSubmit={login}>
                <div className="form-group">
                    <label htmlFor=''>Email:</label>
                    <input type="text" name="email" className='form-control' onChange={(e)=>setEmail(e.target.value)}></input>
                </div>
                <div className="form-group">
                    <label htmlFor=''>Password:</label>
                    <input type="password" name="password" className='form-control' onChange={(e)=>setPassword(e.target.value)}></input>
                </div>
                <p className="text-danger">{formErrors}</p>

                <input type="submit" value="Login" className="btn btn-secondary mt-3" />
            </form>
        </div>
    );
};


export default Login;