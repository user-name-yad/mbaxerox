const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    batchno:{
        type:Number,
        unique:true,
        required:true,
    },
    total:{
        type:Number,
        required:true,
    },
    account:[]
})

const UserModel = mongoose.model('user',UserSchema)
module.exports=UserModel