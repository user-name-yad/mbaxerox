require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const AdminModel = require('./models/AdminModel.js')
const UserModel = require('./models/UserModel.js')

const app = express()
app.use(cors());
app.use(express.json())
app.use(cookieParser())



app.get('/', (req, res) => {
    return res.json('damn im working')
})

//login
app.post('/login', (req, res) => {
    const { email, password } = req.body
    AdminModel.findOne({ email })
        .then(user => {
            if (user) {                
                if (ismatch(password,user.password)) {
                    const accessToken = jwt.sign({ email: email }, "access-token-secret-key", { expiresIn: '15m' })
                    const refreshToken = jwt.sign({ email: email }, "refersh-token-secret-key", { expiresIn: '30m' })
                    res.cookie('accessToken', accessToken, { maxAge: 900000 })
                    res.cookie('refreshToken', refreshToken, { maxAge: 1800000, httpOnly: true, secure: true, sameSite: 'strict' })
                    // res.cookie('accesToken', accessToken, { maxAge: 300000, httpOnly: true, secure: true, sameSite: 'strict' })
                    return res.json({ Login: true ,ass:accessToken,ref:refreshToken})
                }
                else {
                    return res.json({ Login: false, Message: "no record but user exist" })
                }
            } else {
                return res.json({ Login: false, Message: "no record" });
            }
        }).catch(err => {res.json(err.message)})
})
async function ismatch(password,pswd){
    const ismatch = await bcrypt.compare(password,pswd)
    return ismatch
}

// //verify
const verfiyUser = (req, res, next) => {
    const accesstoken = req.cookies.accessToken;
    if (!accesstoken) {
        if (renewToken(req, res)) {
            next()
        }
    } else {
        jwt.verify(accesstoken, "access-token-secret-key", (err, decoded) => {
            if (err) return res.json({ valid: false, message: 'invalid token' })
            else {
                req.email = decoded.email
                next()
            }
        })
    }
}

// //renewtoken
const renewToken = (req, res) => {
    const refreshtoken = req.cookies.refreshToken;
    let exist = false;
    if (!refreshtoken) {
        res.json({ valid: false, message: 'no refresh token' })
    } 
    else {
        jwt.verify(refreshtoken, "refersh-token-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ valid: false, message: 'invalid refresh token' })
            } else {
                const accessToken = jwt.sign({ email: decoded.email }, "access-token-secret-key", { expiresIn: '15m' })
                res.cookie('accessToken', accessToken, { maxAge: 60000 })
                exist = true;
            }
        })
    }
    return exist
}
// const renewToken = (req, res) => {
//     const refreshtoken = req.cookies.refreshToken;
//     let exist = false;
//     if (refreshtoken) {
//         jwt.verify(refreshtoken, 'jwt-refresh-token-secret-key', (err, decoded) => {
//             if (err) {
//                 return res.json({ valid: false, message: 'invalid refresh token' })
//             } else {
//                 const accessToken = jwt.sign({ email: decoded.email }, "jwt-access-token-secret-key", { expiresIn: '15m' })
//                 res.cookie('accessToken', accessToken, { maxAge: 60000 })
//                 exist = true;
//             }
//         })
//     }
//     return exist
// }

app.get('/dashboard',verfiyUser, (req, res) => {
    return res.json({ valid: true, message: 'authorized' })
})

app.post('/adduser', (req, res) => {
    const { name, batchno, total } = req.body
    UserModel.create({ name, batchno, total }).then(user => {return res.json(user)}).catch(err => {return res.json(err)})
})

app.post('/deleteuser', (req, res) => {
    const { deletebatch } = req.body
    UserModel.findOneAndDelete({ batchno: deletebatch })
        .then((user) => {
            return res.json(user)
        })
        .catch(() => {return res.json()})

})

app.post('/deductamt',async(req,res)=>{
    const {deduction} = req.body
    // console.log(deduction);
    const title = deduction.title
    const amount = deduction.amount
    // console.log(title,amount);
    if(isNumeric(amount)){
        let lowBalance=[]
    const data = await UserModel.find({})
    for(let i=0;i<data.length;i++){
        if((data[i].total) < Number(deduction.amount)){
            // lowBalance.push(data[i].batchno+"-"+data[i].name)
            lowBalance.push({batchno:data[i].batchno,name:data[i].name})
        }
        else {
            // const mode = {deduction.title,deduction.amount}
            UserModel.findByIdAndUpdate({_id:data[i]._id},{ $push: { account: {title:title,amount:amount}  } }).then(user=>{}).catch(err=>{})
            let updatedAmt = (data[i].total)-Number(amount)
            UserModel.findByIdAndUpdate({_id:data[i]._id},{total:updatedAmt}).then(user=>{}).catch(err=>{})

        }
    }
    return res.json({isnumeric:true,lowBalance,reason:title})
    }
    else{
        return res.json({isnumeric:false})
    }
})

// app.put('/deductcheckamt',async (req, res) => {
//     const { deduction } = req.body
//     const title = deduction.title
//     const amount = deduction.amount

//     if (isNumeric(amount)) {
//         // let updatedAmt = (data[i].total) - Number(amount)
//         // const data = await UserModel.find({})
//         // for (let i = 0; i < data.length; i++) {
//         //     if ((data[i].total) > Number(deduction.amount)) {
//         //         let updatedAmt = (data[i].total) - Number(amount)
//                 // UserModel.findByIdAndUpdate({ _id: data[i]._id }, { $push: { account: { title: title, amount: amount } } }).then(user => { }).catch(err => { })
//                 // UserModel.findByIdAndUpdate({ _id: data[i]._id }, { total: updatedAmt }).then(user => { }).catch(err => { })

//                 // await UserModel.findByIdAndUpdate({ _id: data[i]._id },{$push: { account: { title: title, amount: amount } } , total: updatedAmt}) 

//                 // UserModel.findByIdAndUpdate({ _id: data[i]._id },{$push: { account: { title: title, amount: amount } } , total: updatedAmt} ,{ total: updatedAmt }).then(user => { }).catch(err => { })
               
//         //     }
//         //     else return res.json({isnumeric:false})
//         // }      
//         UserModel.updateMany(
//             {total: {$gte: amount}},
//             {
//                 $push: { account: {title:title,amount:amount} },
//                 $inc : {total : -amount},
//             },
//             { multi: true }).then(()=>res.json({isnumeric:true})).catch((err)=>res.json(err))
//     }
//     else return res.json({isnumeric:false})
// })

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

app.get('/findall', async (req, res) => {
    try {
        const data = await UserModel.find({})
        return res.json(data)
    } catch (error) {
        return res.json(error.message)
    }
})

app.post('/findonee', (req, res) => {
    const { batchno } = req.body
    UserModel.findOne({ batchno })
        .then(user => {return res.json(user)})
        .catch(err => {return res.json(err)})
})

app.delete('/deleteall',(req,res)=>{
    UserModel.deleteMany({}).then(()=>res.json('deleted all')).catch(err=>res.json(err))
})

app.post('/totaledit', (req, res) => {
    const { editTotalBatchno, edittotal } = req.body
    UserModel.findOneAndUpdate({ batchno: editTotalBatchno }, { $inc: { total: edittotal } })
    .then(user => {return res.json(user)})
    .catch(err => {return res.json(err)})
})
app.post('/createadmin',(req,res)=>{
    const {email,password} = req.body
    AdminModel.create({email,password}).then(user=>res.json(user)).catch(err=>res.json(err))
})

mongoose.connect("mongodb+srv://yadhavan:doomsday@cluster0.3yca6is.mongodb.net/xeroxData?retryWrites=true&w=majority&appName=Cluster0").then(() => {
    console.log("connected to database");
    app.listen(5000, () => {
        console.log("damn its working");
    })
}).catch((err) => {
    console.log(err.message);
})
