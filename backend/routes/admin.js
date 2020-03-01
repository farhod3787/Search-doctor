const express = require('express');
const Admin = require('../moduls/admin');

const router = express.Router();

 //                                                               R e g i  s t r a t s i o n
router.post('/', async function (request, response, next) {
    console.log("Post Admin");
   var body = request.body;
    let admin = {
        login : body.login, 
        password: await Admin.hashofPassword(body.password),
    }
    const admin_new = new Admin(admin);
    console.log(admin_new);
        let token = await Admin.generateToken(admin.login, admin.password);

        admin_new.save().then( (res) =>{
        response.status(200).json({token: token})
    }).catch( err =>{
        console.log(err);
        response.status(404).json({message: "Error in Saved Admin"})
    })
});

       
router.get('/', (request, response, next) =>{
    var admins = [];
    Admin.find().then( (all) =>{
        for (let i=all.length-1; i>=0; i--) {
            admins.push(all[i]);
        }
        response.status(200).json(admins);
    }).catch(  (err)=>{
        console.log(err)
        response.status(400).json({message: "Error in Get All Users"});
    })
});


router.get('/:id', async function(request, response) {
    var data = {};
    var success = false;
    var id = request.params.id;
    
    var body = request.body;
    var admins = await Admin.find();

    var obj = Admin.verifyAdmin(admins, body);

    if(obj.isAdmin) {
        success = true;
        data = await Admin.findById(id).then( (res)=>{
            if(!res) {
                success = false;
                data.message = "User not found"
                return null;
            }
            else {
                return res;
            }
        })
        .catch( (err) =>{
            console.log(err);
            success = false;
        });
        if(success) {
            response.status(200).json(data);
        }
        else {
            response.status(400).json() 
        }
    }
})


router.delete('/:id/:token', async function (request, response, next ){
    var data = {};
    var id = request.params.id;
    var token = request.params.token;
    var users = await Admin.find();
    var success = false;
    var obj = Admin.verifyAdmin(users, token);

    if (obj.isAdmin) {
        success = true
            await Admin.findById(id).then( (res) =>{
                if(res) {
                    return res
                }
                else {
                    success = false
                    data.message = "This Admin not found";
                    return null;
                }
            }).catch( err =>{
                success = false
                response.status(400).json({message: "Admin not found"});
            })
             
                await Admin.findByIdAndRemove(id).catch( err => {
                    success = false;
                })
                if(success) {
                    response.status(200).json({message: "Admin deleted"})
                }
                else {
                    response.status(400).json({message: "Error in Delete Admin"})
                }
            }
    
    else {
        response.status(400).json(data)
    }
})

router.patch('/:id', async function(request, response) {
    var id = request.params.id;
    let body = {};
    Admin.findById(id).then(res => {
        body = res;
        body.status = true;
        Admin.findByIdAndUpdate(id, { $set: body }, { new: true }).then(res => {
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


router.get('/verifyAdmin/:token', async function(request, response) {
     var token = request.params.token;
        var admins = await Admin.find();

    var obj = Admin.verifyOfAdmin(admins, token);
    response.status(200).json(obj);
})
 //                                                                K i r  i  sh

router.post('/sign', async function(request, response) {
    var body = request.body;
    var data = {}
    var admins = await Admin.find();
    console.log(admins);
    var obj = Admin.verifyAdmin(admins, body);

    if(obj.isAdmin) {
        data.token = obj.token;
        data.isAdmin = obj.isAdmin;
        response.status(200).json(data)
    }
    else {
        response.status(404).json({message: "User Not found!"})
    }
});
 


module.exports = router