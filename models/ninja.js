const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NinjaSchema = new Schema({
    
    name:{
                type: String,
                required:true
            },
    email:{
        type: String,
        required:true
    },
    password:{
                type: String,
                required:true
            }
})

const Ninja = new mongoose.model('ninja', NinjaSchema);

module.exports = Ninja;