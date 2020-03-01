const express = require('express');
const Doctor = require('../moduls/users');
const Admin = require('../moduls/admin');

const router = express.Router();

 //                                                               R e g i  s t r a t s i o n
router.post('/', async function (request, response, next) {
    console.log("Post User");
   var body = request.body;
    let doctor = {
        fullName : body.fullName, 
        phone : body.phone,
        address : body.address,
        location: {
            latitude: body.latitude,
            longitude: body.longitude
        },
        specialist: body.specialist,
        category: body.category,
        practice: body.practice,
        rating: body.rating,        
        login : body.login,
        password: await Doctor.hashofPassword(body.password),
    }
    const doc = new Doctor(doctor);
    console.log(doc);
        let token = await Doctor.generateToken(doc.login, doc.password);

        doc.save().then( (res) =>{
        response.status(200).json({token: token})
    }).catch( err =>{
        console.log(err);
        response.status(404).json({message: "Error in Saved doctor"})
    })
});

       
router.get('/', (request, response, next) =>{
    var users = [];
    Doctor.find().then( (all) =>{
        for (let i=all.length-1; i>=0; i--) {
            users.push(all[i]);
        }
        response.status(200).json(users);
    }).catch(  (err)=>{
        console.log(err)
        response.status(400).json({message: "Error in Get All Users"});

    })
});


router.get('/:id', async function(request, response) {
    var data = {};
    var id = request.params.id;
  
    await Doctor.findById(id).then( (res)=>{
            if(!res) {
                success = false;
                data = "User not found"
                response.status(400).json(data);
            }
            else {
                data = res;
                response.status(200).json(data);
            }
        })
        .catch( (err) =>{
            console.log(err);
            response.status(400).json() 
        });
});


router.delete('/:id/:token', async function (request, response, next ){
    var data = {};
    var id = request.params.id;
    var token = request.params.token;
    var users = await Admin.find();
    var obj = Admin.verifyOfAdmin(users, token);

    if (obj.isAdmin) {
        Doctor.findByIdAndDelete(id).then( res => {
            if (!res) {
                  response.status(400).json({message: 'ID not found'})
            } else {
                response.status(200).json({message: 'Doctor deleted'});
            }
        });
            }
    else {
        response.status(400).json(data)
    }
})

router.patch('/:id', async function(request, response) {
    var id = request.params.id;
    let body = {};
    Doctor.findById(id).then(res => {
        body = res;
        body.status = true;
        Doctor.findByIdAndUpdate(id, { $set: body }, { new: true }).then(res => {
            if (res) {
                response.status(200).json({ message: "Status: True" })
            } else {
                response.status(400).json({ message: "Error in status" })
            }
        }).catch(err => {
            console.log(err);
            response.status(400).json(err);
        })
    })
})


router.get('/verifyUser/:token', async function(request, response) {
     var token = request.params.token;
        var users = await Doctor.find();

    var obj = Doctor.verifyOfUser(users, token);
    response.status(200).json(obj);
 
})
 //                                                                K i r  i  sh

router.post('/sign', async function(request, response) {
    var body = request.body;
    var data = {}
    var users = await Doctor.find();
    console.log(users);
    var obj = Doctor.verifyUser(users, body);

    if(obj.isDoctor) {
        data.token = obj.token;
        data.isDoctor = obj.isUser;
        response.status(200).json(obj)
    }
    else {
        response.status(404).json({message: "User Not found!"})
    }
});
 


module.exports = router