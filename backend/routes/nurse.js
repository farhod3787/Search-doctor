const express = require('express');
const Nurse = require('../moduls/nurse');
const Admin = require('../moduls/admin');

const router = express.Router();

 //                                                               R e g i  s t r a t s i o n
router.post('/', async function (request, response, next) {
    console.log("Post User");
   var body = request.body;
    let nurse = {
        fullName : body.fullName, 
        phone : body.phone,
        address : body.address,
        latitude: body.latitude,
        longitude: body.longitude,
        specialist: body.specialist,
        category: body.category,
        practice: body.practice,
        rating: body.rating,        
        login : body.login,
        password: await Nurse.hashofPassword(body.password),
    }
        const doc = new Nurse(nurse);
        let token = await Nurse.generateToken(doc.login, doc.password);

        doc.save().then( (res) =>{
        response.status(200).json({token: token})
    }).catch( err =>{
        console.log(err);
        response.status(404).json({message: "Error in Saved nurse"})
    })
});

       
router.get('/', (request, response, next) =>{
    var users = [];
    Nurse.find().then( (all) =>{
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
  
    await Nurse.findById(id).then( (res)=>{
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
        Nurse.findByIdAndDelete(id).then( res => {
            if (!res) {
                  response.status(400).json({message: 'ID not found'})
            } else {
                response.status(200).json({message: 'nurse deleted'});
            }
        });
            }
    else {
        response.status(400).json(data)
    }
})

router.patch('/:id/:token', async function(request, response) {
    var id = request.params.id;
    let body = {};
    var token = request.params.token;
    var nurses = await Nurse.find();
    var admins = await Admin.find();
    var obj = Admin.verifyOfAdmin(admins, token);
    var object = Nurse.verifyOfUser(nurses, token);
    if(obj.isAdmin || object.isNurse) {  
    Nurse.findById(id).then(res => {
        body = res;
        body.status = true;
        Nurse.findByIdAndUpdate(id, { $set: body }, { new: true }).then(res => {
            if (res) {
                response.status(200).json({ message: "Status: True" })
            } else {
                response.status(400).json({ message: "Error in status" })
            }
        }).catch(err => {
            console.log(err);
            response.status(400).json({ message: "Error in status" });
        })
    })
} else {
    response.status(400).json({message: "This is not nurse or Not Admin"})
}
})


router.get('/verifyUser/:token', async function(request, response) {
     var token = request.params.token;
        var users = await Nurse.find();

    var obj = Nurse.verifyOfUser(users, token);
    response.status(200).json(obj);
 
})
 //                                                                K i r  i  sh

router.post('/sign', async function(request, response) {
    var body = request.body;
    var data = {}
    var users = await Nurse.find();
    console.log(users);
    var obj = Nurse.verifyUser(users, body);

    if(obj.isNurse) {
        data.token = obj.token;
        data.isNurse = obj.isUser;
        response.status(200).json(obj)
    }
    else {
        response.status(404).json({message: "User Not found!"})
    }
});
 


module.exports = router