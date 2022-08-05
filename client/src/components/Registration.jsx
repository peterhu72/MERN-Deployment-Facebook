import React, {useState} from 'react';
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

const Registration = () => {

    let [firstName, setFirstName] = useState("")
    let [lastName, setLastName] = useState("")
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [confirm, setConfirm] = useState("")

    let [formErrors, setFormErrors] = useState({})

    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault()
        let form = {firstName,lastName,email,password,confirm}
        axios.post("http://localhost:8000/api/users/register", form, {withCredentials: true})
            .then(res => {
                console.log(res)
                if (res.data.errors){
                    setFormErrors(res.data.errors)
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
            <h2>Register</h2>
            <form onSubmit={register}>
                <div className="form-group">
                    <label htmlFor=''>First Name:</label>
                    <input type="text" name="firstName" className='form-control' onChange={(e) => setFirstName(e.target.value)}></input>
                    <p className="text-danger">{formErrors.firstName?.message} </p>
                </div>
                <div className="form-group">
                    <label htmlFor=''>Last Name:</label>
                    <input type="text" name="lastName" className='form-control' onChange={(e) => setLastName(e.target.value)}></input>
                    <p className="text-danger">{formErrors.lastName?.message} </p>
                </div>
                <div className="form-group">
                    <label htmlFor=''>Email:</label>
                    <input type="text" name="email" className='form-control' onChange={(e) => setEmail(e.target.value)}></input>
                    <p className="text-danger">{formErrors.email?.message} </p>
                </div>
                <div className="form-group">
                    <label htmlFor=''>Password:</label>
                    <input type="password" name="password" className='form-control' onChange={(e) => setPassword(e.target.value)}></input>
                    <p className="text-danger">{formErrors.password?.message} </p>
                </div>
                <div className="form-group">
                    <label htmlFor=''>Confirm Password:</label>
                    <input type="password" name="confirm" className='form-control' onChange={(e) => setConfirm(e.target.value)}></input>
                    <p className="text-danger">{formErrors.confirm?.message} </p>
                </div>
                <input type="submit" value="Register" className="btn btn-success" />
            </form>
        </div>
    );
};


export default Registration;