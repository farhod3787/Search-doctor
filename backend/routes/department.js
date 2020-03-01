const express = require('express');
const Admin = require('../moduls/admin');
const Department = require('../moduls/department')
const router = express.Router();

 //                                                               R e g i  s t r a t s i o n
router.post('/:token', async function (request, response, next) {
    console.log("Post User");
    const admins = await Admin.find();
    const token = request.params.token;
    const obj = Admin.verifyOfAdmin(admins, token);
    if (obj.isAdmin) {
        var body = request.body;
        let department = {
            name : body.name, 
            hospitalId : body.hospitalId
        }
        const dep = new Department(department);
        dep.save().then( (res) =>{
            response.status(200).json(res)
        }).catch( err =>{
            console.log(err);
            response.status(404).json({message: "Error in Saved Hospital"})
        })
    }
});

       
router.get('/', (request, response, next) =>{
    var departments = [];
    Department.find().then( (all) =>{
        for (let i=all.length-1; i>=0; i--) {
            departments.push(all[i]);
        }
        response.status(200).json(departments);
    }).catch(  (err)=>{
        console.log(err)
        response.status(400).json({message: "Error in Get All Depertments"});

    })
});


router.get('/:id', async function(request, response) {
    var data = {};
    var id = request.params.id;
  
    await Department.findById(id).then( (res)=>{
            if(!res) {
                success = false;
                data = "User not found"
                response.status(400).json(data);
            } else {
                data = res;
                response.status(200).json(data);
            }
        })
        .catch( (err) =>{
            console.log(err);
            response.status(400).json({message: "Hospital Not found"}) 
        });
});


router.delete('/:id/:token', async function (request, response, next ){
    var data = {message: 'Not admin'};
    var id = request.params.id;
    var token = request.params.token;
    var admins = await Admin.find();
    var obj = Admin.verifyOfAdmin(admins, token);

    if (obj.isAdmin) {
              Department.findByIdAndDelete(id).then( res => {
                  if (!res) {
                        response.status(400).json({message: 'ID not found'})
                  } else {
                      response.status(200).json({message: 'Department deleted'});
                  }
              });
            }
    else {
        response.status(400).json(data)
    }
})

router.patch('/:id', async function(request, response) {
    var id = request.params.id;
    let body = request.body;
        Department.findByIdAndUpdate(id, { $set: body }, { new: true }).then(res => {
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
 

module.exports = router