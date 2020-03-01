const mongoose = require('mongoose');

const hospitalSchema = mongoose.Schema({
    name: {type: String},
    address: {type: String},
    rating: {type: String},
    time: {type: String}
});

module.exports = mongoose.model('hopitals', hospitalSchema);
