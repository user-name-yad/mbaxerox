import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [batchno, setBatchno] = useState('')
  const [total, setTotal] = useState('')
  const [deletebatch, setDeleteBatch] = useState('')
  const [deduction, setDeduction] = useState({ title: '', amount: '' })
  const [edittotal, setEdittotal] = useState('')
  const [editTotalBatchno, setEditTotalBatchno] = useState('')
  const [allusers, setAllusers] = useState([])

  //hglhjblh
 const[lowbalance,setLowbalance] = useState([])

  axios.defaults.withCredentials=true
  useEffect(()=>{
      axios.get(`https://users-api-neon.vercel.app/dashboard`)
      .then(res=>{
          if(res.data.valid === false){
              navigate('/')
          }
      })
      .catch(err=>console.log(err))
  })

  function handleAddUser(e) {
    e.preventDefault()
    if(name==='' || name[0]===' ' || batchno==='' || batchno[0] === ' ' || total==='' || total[0]===' '){
      setName('')
      setBatchno('')
      setTotal('')
      return alert('Credentials missing')
    }
    axios.post(`https://users-api-neon.vercel.app/adduser`, { name, batchno, total })
      .then((res) => {
        if(res.data.name === "ValidationError"){
          alert("Total is Invalid")
          setName('')
          setBatchno('')
          setTotal('')
        }
        else {
          window.alert(`${res.data.name} Added`)
          setName('')
          setBatchno('')
          setTotal('')}
      })
      .catch(err => console.log(err.message))
  }

  function handleDelete(e) {
    e.preventDefault()
    axios.post(`https://users-api-neon.vercel.app/deleteuser`, { deletebatch })
      .then(res => {
        // console.log(res.data);
        window.alert(`${res.data.name} has been Deleted`)
        setDeleteBatch('')
      })
      .catch(err => {
        alert('Batch number not found :(')
        setDeleteBatch('')
      })
  }

  function handleDeduct(e) {
    e.preventDefault()
    if(deduction.title==='' || deduction.title[0]===' ') {
      setDeduction({ title: '', amount: '' })
      return alert('reason empty')
    }
    axios.post(`https://users-api-neon.vercel.app/deductamt`, { deduction })
      .then((res) => {
        if(res.data.isnumeric === true ){
          setLowbalance(res.data.lowBalance)
          // console.log(res.data.lowBalance);
          window.alert(`Rs.${deduction.amount} deducted for ${deduction.title}`)
          setDeduction({ title: '', amount: '' })
        }
        else {
          window.alert(`Invalid Amount`)
          setDeduction({ title: '', amount: '' })

        }
      })
      .catch(err => console.log(err.message))
  }

  function handleTotal(e) {
    e.preventDefault()
    if(edittotal.length === 0 || edittotal[0]===' ' || editTotalBatchno===''){
      setEditTotalBatchno('')
      setEdittotal('')
      return alert(`some values are invalid`)
    }
    axios.post(`https://users-api-neon.vercel.app/totaledit`, { editTotalBatchno, edittotal })
      .then(res => {
        if(res.data === null){
          setEditTotalBatchno('')
          setEdittotal('')
          return alert(`User not found`)
        }
        else{
          window.alert(`Rs.${edittotal} is added to  ${res.data.name}'s Account now.`)
      }
      })
      .catch(err => {
        console.log(err);
      })
  }

  function getAllUsers(e) {
    e.preventDefault()
    axios.get(`https://users-api-neon.vercel.app/findall`).then(res => {
      // console.log(res.data);
      setAllusers(res.data)
    })
      .catch(err => console.log(err))
  }

  return (
    <div className="container-fluid dashcover" >
      <div className="container d-flex flex-column justify-content-around">
        <div className="row m-3">
          <div className="col-lg-4 col-md-6">
            <form onSubmit={handleAddUser} className='box'>
              <div style={{ fontWeight: "bold", fontSize: "large", color: 'black', fontFamily: "Montserrat,san serif" }}>Add User</div>
              <label htmlFor="name">Name</label>
              <input type="text" id='name' placeholder='Name' value={name} onChange={e => setName(e.target.value)} />

              <label htmlFor="batchno">Batch.no</label>
              <input type="text" id='batchno' placeholder='Batch.no' value={batchno} onChange={e => setBatchno(e.target.value)} />

              <label htmlFor="total">Total</label>
              <input type="text" id='total' placeholder='Total' value={total} onChange={e => setTotal(e.target.value)} />
              <button type='submit'>Add</button>
            </form>
          </div>
          <div className="col-lg-4 col-md-6">
            <form onSubmit={handleDelete} className='box'>
              <label htmlFor="delete">Delete User</label>
              <input type="text" id='delete' placeholder='Batch NO' value={deletebatch} onChange={e => setDeleteBatch(e.target.value)} />
              <button type='submit'>Delete</button>
            </form>
          </div>
          <div className="col-lg-4 col-md-6">
            <form onSubmit={handleDeduct} className='box'>
              <label htmlFor="deduction">Deduction</label>
              <input type="text" id='deduction' placeholder='Reason' value={deduction.title} onChange={e => setDeduction({ ...deduction, title: e.target.value })} />
              <label htmlFor="amount">Amount</label>
              <input type="text" id='amount' placeholder='Amount' value={deduction.amount} onChange={e => setDeduction({ ...deduction, amount: e.target.value })} />
              <button type='submit'>Deduct</button>
            </form>
          </div>
        </div>


        <div className="row m-3">
          <div className="col-lg-4 col-md-6">
            <form onSubmit={handleTotal} className='box'>
              <div style={{ fontWeight: "bold", fontSize: "large", color: 'black', fontFamily: "Montserrat,san serif" }}>Edit Total</div>
              <label htmlFor="editTotalBatchno">Batch No</label>
              <input type="text" id='editTotalBatchno' placeholder='Batch.No' value={editTotalBatchno} onChange={e => setEditTotalBatchno(e.target.value)} />
              <label htmlFor="editTotal">Total</label>
              <input type="text" id='editTotal' placeholder='Total' value={edittotal} onChange={e => setEdittotal(e.target.value)} />
              <button type='submit'>Add Total</button>
              {/* {<p>{totalBalance}</p>} */}
            </form>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="boxx" style={{ padding: "5px" }}>
              <button onClick={getAllUsers}>List all User</button>
              <h6>{allusers.length}</h6>
              {
                (allusers.length !== 0) ? (
                  <div>
                    <table className='table table-striped' style={{ margin: '3px', borderRadius: "5px" }}>
                      <thead>
                        <tr>
                          <th scope='col'>Batch.No</th>
                          <th scope='col'>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          allusers.map((value, index) => {
                            return <tr key={index}>
                              <td>{value.batchno}</td>
                              <td>{value.name}</td>
                            </tr>
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div></div>
                )
              }
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="boxx" style={{ padding: "5px" }}>
              <p style={{marginTop:'5px',fontFamily:'Montserrat',fontWeight:'bold'}}>Insufficient Balance</p>
              {
                (lowbalance.length !== 0) ? (
                  <div>
                    <table className='table table-striped table-dark' style={{ margin: '3px', borderRadius: "5px" }}>
                      <thead>
                        <tr>
                          <th scope='col'>Batch.No</th>
                          <th scope='col'>Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          // allusers.filter(user => Number(user.total) <= 5).map((value, index) => {
                          //   return <tr key={index}>
                          //     <td>{value.batchno}</td>
                          //     <td>{value.name}</td>
                          //   </tr>
                          // })
                          lowbalance?.map((val,ind)=>{
                               return <tr key={ind}>
                              <td>{val.batchno}</td>
                              <td>{val.name}</td>
                            </tr>
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div></div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>


  )
}

export default Dashboard
