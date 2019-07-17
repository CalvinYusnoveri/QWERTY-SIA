const express = require('express');
const mongodb = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const mydb= `${process.env.MONGO_DB}`;
const mycollection= `${process.env.MONGO_COLLECTION_INVENTORY}`;
const url = `${process.env.MONGO_URL}`;


const router = express.Router();

console.log(mydb,mycollection,url);
//Get Post
router.get('/get', async(req,res)=>{
    const fallback = await InventoryData();
    fallback_result = await fallback.find({}).toArray()
    res.send(fallback_result);
    fallback_data = JSON.stringify(fallback_result,null,2);
})

// TODO: Delete Post
// router.delete('/:id',async(req,res)=>{
//     const fallback = await InventoryData();
//     await fallback.deleteOne({_id:new mongodb.ObjectID(req.params.id)});
//     res.status(200).send();
// })

//Establish the mongodb connection
async function InventoryData(){
    const mongoClient = await mongodb.MongoClient.connect(url,{useNewUrlParser:true});
    return mongoClient.db(mydb).collection(mycollection);
}


module.exports = router;