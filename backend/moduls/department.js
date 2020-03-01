const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
    name: {type: String},
    hospitalId: {type: String}
});

module.exports = mongoose.model('department', departmentSchema);
