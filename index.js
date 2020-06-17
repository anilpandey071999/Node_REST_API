const express = require('express');

const morgan = require('morgan');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/Rest_Api',
{ useNewUrlParser: true ,
 useUnifiedTopology: true
 }).then(()=>{
    console.log('Connected to the database..........')
})
mongoose.connection.on('connected',()=>{
    console.log("Mongoose connected to db..");
})

mongoose.connection.on('error',(err)=>{
    console.log(err.message);
})

mongoose.connection.on('disconnection',()=>{
    console.log('Mongoose connection is disconnected....');
})

process.on('SIGINT',()=>{
    mongoose.connection.close(()=>{
        console.log("Mongoose connection is disconnection due to app termination...");
        process.exit(0);
    });
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//all can handel any kind of reqest (eg:GET,POST,PATCH,DELETE)
app.all('/test',(req,res)=>{

    /*
    for query kind of url parseing
     http://localhost:3000/test?name=imac&price=2300
     app.all('/test',(req,res)=>{
     console.log(req.query);
     console.log(req.query.name);
     res.send(req.query);
     })
    */
   /*
   for params kind of url parseing
   http://localhost:3000/test/789876 
   app.all('/test/:id',(req,res)=>{
    console.log(req.params)
    res.send(req.params)
   })
    */
   /**
    * for body parser of url parseing
POST http://localhost:3000/test
Content-Type: application/x-www-form-urlencoded

name=imac&price=4999

app.all('/test',(req,res)=>{
   console.log(req.body);
   console.log(req.body.name);
   res.send(req.body);
})
    */
 

})



const ProductRoute = require('./Routes/Product.routes');
const createHttpError = require('http-errors');
app.use('/products', ProductRoute);

app.use(morgan("dev"));



app.use((req,res,next)=>{
    // const err = new Error("NOT FOUND")
    // err.status = 404;
    // next(err);
    next(createHttpError(404,"Not Found"))
})



app.use((err,req,res,next)=>{
    res.status(err.status||500);
    res.send({
        error:{
            status: err.status|| 500,
            message: err.message
        }
    })
})


app.listen(3000,()=>{
    console.log('Server is listen on port 300');
})