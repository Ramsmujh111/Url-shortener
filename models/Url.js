const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    urlCode:String,
    longUrl:String,
    shortUrl:String,
    create_At:{
        type:String,
        default:Date.now
    },
    expire_at:{
        default:false,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default:'123'
    },
})

module.exports = mongoose.model('Url' , urlSchema);