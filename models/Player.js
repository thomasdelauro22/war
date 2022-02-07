const mongoose = require('mongoose');

const PlayerSchema = mongoose.Schema({
    winningUser: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Player', PlayerSchema)