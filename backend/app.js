const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRouter = require('./routes/admin');
const userRouter = require('./routes/users'); 
const hospitalRouter = require('./routes/hospitals');
const departmentRouter = require('./routes/department');
const doctorRouter = require('./routes/doctors');
const cors = require("cors");
const app = express();

app.use(cors());


// mongoose.connect('mongodb+srv://farhod:7Q8SfcHx.F2J.HG@cluster0-uf7cc.mongodb.net/mercedec?retryWrites=true', { useNewUrlParser: true })
//     .then(() => {
//         console.log('MongoDB connected.');
//     })
//     .catch(err => console.log(err));

mongoose.connect("mongodb://localhost:27017/help-doctor").then( () => {
    console.log('Connected to database')
})
.catch( () =>{
    console.log('Error in connected database')
});



module.exports = { mongoose };


// app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use('/', express.static(path.join(__dirname, '../dist/online-pharmacy')))

app.use('/images', express.static(path.join("backend/images")));
// app.use('/recipe', express.static(path.join("backend/recipe")));


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Request-Width, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next()
});

app.use('/api/admin', adminRouter);
app.use('/api/users/', userRouter); 
app.use('/api/hospital/', hospitalRouter); 
app.use('/api/department/', departmentRouter); 
app.use('/api/doctor/', doctorRouter); 

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../dist/online-pharmacy', 'index.html'))
// })

module.exports = app;
