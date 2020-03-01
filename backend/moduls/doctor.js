const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const doctorSchema = mongoose.Schema({
    fullName: {type: String},
    phone: {type: String},
    address: {type: String},
    location: { 
        latitude: {type: Number},
        longitude: {type: Number}
    },
    specialist: {type: String},
    category: {type: String},
    practice: {type: String},
    rating: {type: Number},             // max = 5
    login: {type: String},
    password: {type: String}
});

doctorSchema.statics.hashofPassword = function(pass) {
    let password = {password: pass};
    let hashpass = jwt.sign(password, 'pro');
    return hashpass;
}

doctorSchema.statics.generateToken = function(login, password) {
    var value = {
        login: login,
        password: password
    }
    
    var token = jwt.sign(value, 'pro');
    return token;
}


//                                                               K i r i  sh

doctorSchema.statics.verifyUser = function(users, body) {
    var object = {isDoctor : false};
    var distoken = undefined; 

    users.forEach((user) => {
        try{
            distoken = jwt.verify(user.password, 'pro');
        console.log(distoken);
        }
        catch {
        }
        if (distoken) {
            if(user.login == body.login && distoken.password == body.password ) {
                    object.isDoctor = true;
                    object.token = jwt.sign({login: user.login, password: user.password}, 'pro')
            }
        }
        else {
            console.log("Distoken Undefined")
        }
    })
    return object;
}



//                                                      T e k s  h i r i  s h

doctorSchema.statics.verifyOfUser = function(users, token) {
    var object = {isDoctor : false,  doctorId: undefined};
    var distoken = undefined; 

    users.forEach((user) => {
        try{
            distoken = jwt.verify(token, 'pro');
        }
        catch {

        }
        if (distoken) {
            if(user.login == distoken.login && user.password == distoken.password ) {
                    object.isDoctor = true;
                    object.token = jwt.sign({login: user.login, password: user.password}, 'pro');
                    object.doctorId = user._id;
                    object.doctorName = user.fullName;
            }
        }
        else {
            console.log("Distoken Undefined")
        }
    })
    return object;
}

module.exports = mongoose.model('doctors', doctorSchema);