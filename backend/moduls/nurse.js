const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const nurseSchema = mongoose.Schema({
    fullName: {type: String},
    phone: {type: String},
    address: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    specialist: {type: String},
    category: {type: String},
    practice: {type: String},
    rating: {type: Number},             // max = 5
    login: {type: String},
    password: {type: String}
});

nurseSchema.statics.hashofPassword = function(pass) {
    let password = {password: pass};
    let hashpass = jwt.sign(password, 'pro');
    return hashpass;
}

nurseSchema.statics.generateToken = function(login, password) {
    var value = {
        login: login,
        password: password
    }
    
    var token = jwt.sign(value, 'pro');
    return token;
}


//                                                               K i r i  sh

nurseSchema.statics.verifyUser = function(users, body) {
    var object = {isnurse : false};
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
                    object.isnurse = true;
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

nurseSchema.statics.verifyOfUser = function(users, token) {
    var object = {isNurse : false,  NurseId: undefined};
    var distoken = undefined; 

    users.forEach((user) => {
        try{
            distoken = jwt.verify(token, 'pro');
        }
        catch {

        }
        if (distoken) {
            if(user.login == distoken.login && user.password == distoken.password ) {
                    object.isNurse = true;
                    object.token = jwt.sign({login: user.login, password: user.password}, 'pro');
                    object.NurseId = user._id;
                    object.nurseName = user.fullName;
            }
        }
        else {
            console.log("Distoken Undefined")
        }
    })
    return object;
}

module.exports = mongoose.model('nurses', nurseSchema);