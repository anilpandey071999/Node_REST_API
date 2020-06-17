const Product = require('../Models/Product.models');
const createHttpError = require('http-errors');
const mongoose  = require('mongoose');


module.exports = {
    getAllProducts:(req,res,next)=>{
        // Product.find({},{name:1,_id:0,price:1})
        // Product.find({price:1149},{})
        Product.find({},{__v:0})
        .then((result)=>{
            res.send(result);
        }).catch((err)=>{
            console.log(err.message)
        })
        // res.send('you are in products reoutes')
        // try{
        //     const result = await Product.find();
        //     res.send(result);
        // }catch(err){
        //     console.log(err.message);
        // }
    },
    createNewProduct:async(req,res,next)=>{
        /*example of async and await  */
        try{
            const product = new Product(req.body);
            const result = await product.save();
            res.send(result);
        }catch(error){
            console.log(error.message);
            if(error.name === 'ValidationError'){
                return next(createHttpError(422,error.message));
            }
            next(error);
        }
    
    
        /*exampal of promise to store in mongodb 
        console.log(req.body)
        const product = new Product({
            name: req.body.name,
            price: req.body.price
        })
        product.save()
        .then(result=>{
            console.log(result);
            res.send(result);
        }).catch(err=>{
            console.log(err.message);
        });*/
    
        // res.send('Product created');
    }, 
    searchSingleProduct:async (req,res,next)=>{
        const id =  req.params.id
        try {
            const product = await Product.findById(id)
            // const product = await Product.findOne({'id': id})
            console.log(product);
            if(!product){
                throw createHttpError(404,'Product Does not exist.')
            }
            res.send(product);
        } catch (error) {
            console.log(error.message)
            if(error instanceof mongoose.CastError){
                next(createHttpError(400,"Invalid Product id"));
                return;
            }
            next(error);
        }
    },
    updateProduct:async(req,res,next)=>{
        try {
            const id = req.params.id;
            const updates = req.body;
            const opstion = {new:true}
            const result = await Product.findByIdAndUpdate(id,updates,opstion);
            if(!result){
                throw createHttpError(404,"Product does not exist");
            }
            res.send(result);
        } catch (error) {
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                return next(createHttpError(400,"Product ID is not vealid"));
            }
            next(error);
        }
    },
    deleteProduct:async (req,res,next)=>{
        const id  = req.params.id;
        try {
            const result = await Product.findByIdAndDelete(id)
            if(!result){
                throw createHttpError(404,'Product Does not exist.')
            }
            res.send(result);
        } catch (error) {
            console.log(error.message);
            if(error instanceof mongoose.CastError){
                next(createHttpError(400,"Invalid Product id"));
                return;
            }
            next(error);
        }
    }


}