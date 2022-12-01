const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName:String,
    googleId:String,
    email:{
        type:String,
    },
    photoURl:{
        type:String
    },
    accessToken:{
        type:String
    }
})

module.exports = mongoose.model('User' , userSchema);