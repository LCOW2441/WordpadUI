const mongoose = require ('mongoose');


const noteSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String
        },
    title: {
        type: String,
        required:true
    },
    content: {
        type: String
    },
    dateadded: {
        type: Date,
        default: Date.now, 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        // type : sessionData.userId
        // ref: 'ninja'
    }
});

module.exports = mongoose.model ("Note", noteSchema);