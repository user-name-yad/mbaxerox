import React from 'react'
import { useNavigate } from 'react-router-dom'
import './styles/home.css'

const Home = () => {
    const navigate = useNavigate()
    function genuser() {
        navigate('generaluser')
    }
    function admlog() {
        navigate('login')
    }
    return (
        <div className='container-fluid  backg'>
            <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-center ">
                    <h1 className='xmba25' style={{ textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 'bold', color: "#e1e1e1" }}>MBA 23 - 25</h1>
                    <div className='col-lg-6 col-sm-5 h-50 space_around '>
                        <div className='buttons mr-auto'>
                            <button onClick={genuser}>General User</button>
                        </div>
                        <div className='buttons'>
                            <button onClick={admlog}>Admin Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home