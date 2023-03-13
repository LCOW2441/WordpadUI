const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NinjaSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    token: {
        type: String
    }
    
})

const Ninja = new mongoose.model('ninja', NinjaSchema);

module.exports = Ninja;