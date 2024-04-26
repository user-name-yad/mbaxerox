import React, { useState } from 'react'
import axios from 'axios'
import './styles/generaluser.css'
import who from './assets/yarnee.gif'

const GeneralUser = () => {
    const [batchno, setBatchno] = useState('')
    const [userdata, setUserdata] = useState({})
    function getDetails(e) {
        e.preventDefault()
        axios.post(`https://users-api-neon.vercel.app/findonee`, { batchno }).then(res => {
            setUserdata(res.data)
            setBatchno('')
        }).catch(err => console.log(err))
    }

    function sum() {
        let amt = 0
        // userdata.account?.map((val, index) => {
        //     amt = amt + Number(val.amount)
        // })
        userdata.account?.forEach((val,ind)=>{
            amt = amt + Number(val.amount)
        })
        return amt
    }

    // useEffect(() => {
    //     console.log(userdata);
    // }, [userdata])

    return (
        <div className='container-fluid backg'>
            <div className="container h-100">
                <div className="row h-100 align-items-center justify-content-around ">
                    <div className='col-lg-5 col-sm-5 h-40 space_around'>
                        <form onSubmit={(e) => getDetails(e)}>
                            <label htmlFor="batchno">Enter your Batch.No :</label>
                            <input type="text" placeholder='Batch No' id='batchno' value={batchno} onChange={e => setBatchno(e.target.value)} />
                            <div>
                                <button type='submit'>Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='col-lg-5 col-sm-5 w-40 boxxx'>
                        { (userdata !== null) ? 
                        <div className='genintab'>
                            <div className='distabled'>
                                <h2 style={{ textAlign: "center" }}>Welcome <span style={{color:"red"}}>{userdata.name}</span> !</h2>
                                <table className='table table-striped table-dark' style={{ margin: '3px', borderRadius: "5px" }}>
                                    <thead>
                                        <tr>
                                            <th scope='col'>Title</th>
                                            <th scope='col'>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            userdata?.account?.map((value, index) => {
                                                return <tr key={index}>
                                                    <td>{value.title}</td>
                                                    <td>{value.amount}</td>
                                                </tr>
                                            })
                                        }
                                        <tr>
                                            <td>Total</td>
                                            <td>{sum()}</td>
                                        </tr>
                                        <tr>
                                            <td>Available Balance</td>
                                            <td>{userdata ? userdata.total : 0}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> : (
                            <div className='d-flex align-items-center justify-content-center'>
                                <img src={who} alt="user not found" style={{height:"150px",width:"256px",marginTop:"80px"}}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    )
}

export default GeneralUser