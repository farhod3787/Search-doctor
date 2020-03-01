const express = require('express');
const User = require('../moduls/users');
const Admin = require('../moduls/admin');
// const jwt = require('jsonwebtoken');

const router = express.Router();

 //                                                               R e g i  s t r a t s i o n
router.post('/', async function (request, response, next) {
    console.log("Post User");
   var body = request.body;
    let user = {
        name : body.name, 
        address : body.address,
        phone : body.phone,
        login : body.login,
        password: await User.hashofPassword(body.password),
    }
    const use = new User(user);
    console.log(user);
        let token = await User.generateToken(use.login, use.password);

    use.save().then( (res) =>{
        response.status(200).json({token: token})
    }).catch( err =>{
        console.log(err);
        response.status(404).json({message: "Error in Saved user"})
    })
});

       
router.get('/', (request, response, next) =>{
    var users = [];
    User.find().then( (all) =>{
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
  
    await User.findById(id).then( (res)=>{
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
    var success = false;
    var obj = Admin.verifyOfAdmin(users, token);

    if (obj.isAdmin) {
        success = true
            await User.findById(id).then( (res) =>{
                if(res) {
                    return res
                }
                else {
                    success = false
                    data.message = "This User not found";
                    return null;
                }
            }).catch( err =>{
                success = false
                response.status(400).json({message: "User not found"});
            })
             
                await User.findByIdAndRemove(id).catch( err => {
                    success = false;
                })
                if(success) {
                    response.status(200).json({message: "User deleted"})
                }
                else {
                    response.status(400).json({message: "Error in Delete User"})
                }
            }
    
    else {
        response.status(400).json(data)
    }
})

router.patch('/:id', async function(request, response) {
    var id = request.params.id;
    let body = {};
    User.findById(id).then(res => {
        body = res;
        body.status = true;
        User.findByIdAndUpdate(id, { $set: body }, { new: true }).then(res => {
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
        var users = await User.find();

    var obj = User.verifyOfUser(users, token);
    response.status(200).json(obj);
 
})
 //                                                                K i r  i  sh

router.post('/sign', async function(request, response) {
    var body = request.body;
    var data = {}
    var users = await User.find();
    console.log(users);
    var obj = User.verifyUser(users, body);

    if(obj.isUser) {
        data.token = obj.token;
        data.isUser = obj.isUser;
        response.status(200).json(data)
    }
    else {
        response.status(404).json({message: "User Not found!"})
    }
});
 


module.exports = router