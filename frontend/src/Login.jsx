import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './styles/login.css'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    // axios.defaults.withCredentials = true;
    function handleSubmit(e) {
        e.preventDefault();
        axios.post(`https://users-api-neon.vercel.app/login`, { email, password })
            .then(res => {
                if (res.data.Login) {
                    navigate('/dashboard')
                }
                else {
                    alert('Invalid credentials')
                }
            })
            .catch(err => console.log(err))
    }
    return (
        <div className='container-fluid specific'>
            <div className='col-lg-5 col-sm-5 h-40 w-40 space_around '>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Name :</label>
                    <input type="text" placeholder='Email' value={email} id='email' onChange={e => setEmail(e.target.value)} /><br /><br />
                    <label htmlFor="password">Password :</label>
                    <input type="password" placeholder='Password' value={password} id='password' onChange={e => setPassword(e.target.value)} /><br /><br />
                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login
