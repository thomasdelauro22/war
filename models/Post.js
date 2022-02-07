const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    winningUser: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Post', PostSchema)