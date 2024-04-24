const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const AdminSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true,
        minLength:6,
    }
})

AdminSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

// AdminSchema.statics.login = async function (email,password){
//     const user = await this.findOne({email})
//     if(user){
//         const auth = await bcrypt.compare(password,user.password)
//         if(auth) return user
//         throw Error('Incorrect credentials')
//     }
//     throw Error('Incorrect Credentials')
// }

const Admin = mongoose.model('Admin',AdminSchema)
module.exports = Admin