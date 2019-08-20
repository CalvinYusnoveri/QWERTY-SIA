const express = require('express');
const mongodb = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const mydb= `${process.env.MONGO_DB}`;
const mycollection= `${process.env.MONGO_COLLECTION_INVENTORY}`;
const url = `${process.env.MONGO_URL}`;

const router = express.Router();

router.get('/test',async(req,res)=>{
  res.send("This is a test meassage.");
  console.log("This is a test meassage.");
})

async function getInv(req, res, next) {
  const inventory_collection = await InventoryData(req);
  if (inventory_collection == 'action !== inventory-data'){
    res.send('action !== inventory-data');
  }else{
    console.log('in getInv')
    var inv = {'name': `${req.body.queryResult.parameters.Inventory}`}
    inventory_result = await inventory_collection.find({});
    console.log('inv', inv)
    inventory_data = JSON.stringify(inventory_result,null,2);
    console.log('inventory_data', inventory_data)
    req.body.queryResult['fulfillmentText'] = inventory_data
    console.log(JSON.stringify(req.body.queryResult))
    res.send(req.body.queryResult);
  }
}

//Get Post
router.post('/inventory/get', async(req,res)=>{

    const inventory_collection = await InventoryData(req);
    if (inventory_collection == 'action !== inventory-data'){
      res.send('action !== inventory-data');
    }else{
      inv = req.body.queryResult.parameters.Inventory
      inventory_result = await inventory_collection.find({"inventory": `${inv}`}).toArray();
      inventory_data = JSON.stringify(inventory_result,null,2);
      req.body.queryResult.fulfillmentText += `\n${inventory_data}`   // Change
      res.send(req.body.queryResult);
    }

})

// TODO: Delete Post
// router.delete('/:id',async(req,res)=>{
//     const fallback = await InventoryData();
//     await fallback.deleteOne({_id:new mongodb.ObjectID(req.params.id)});
//     res.status(200).send();
// })

//Establish the mongodb connection (until collection)
async function InventoryData(req){

  // const mongoClient = await mongodb.MongoClient.connect(url,{useNewUrlParser:true});
  // return mongoClient.db(mydb).collection(mycollection);
    
    if (req.body.queryResult.action === 'inventory-data') {
        console.log('action: inventory-data');
        try{
          const mongoClient = await mongodb.MongoClient.connect(url,{useNewUrlParser:true});
          console.log('mongoClient', mongoClient)
          return mongoClient.db(mydb).collection(mycollection);
        } catch (err) {
          console.log("error connecting to db...\n", err)
        }
      } else {
        console.log('action is not inventory-data :(');
        return 'action !== inventory-data';
      }

}

exports.getInv = getInv
