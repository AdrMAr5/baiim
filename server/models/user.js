const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    id:{

    },
    login:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema)