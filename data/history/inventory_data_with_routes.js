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
  if (inventory_collection == 'action !== get-inventory-data'){
    console.log('action !== get-inventory-data'); 
    next() 
  }else{
    console.log('action === get-inventory-data')
    var spare_part_name = {'name': `${req.body.queryResult.parameters.name}`}
    inventory_result = await inventory_collection.findOne(spare_part_name);
    console.log('spare_part_name:', spare_part_name)
    console.log('inventory_data', inventory_result)
    if (inventory_result === null){
      console.log('no such item:',spare_part_name.name)
      inventory_data = {'no such item:':spare_part_name.name}
    }else{
      inventory_data = JSON.stringify(inventory_result,null,2);
      console.log(inventory_data)
    }
    req.body.queryResult['fulfillmentText'] = inventory_data
    console.log(JSON.stringify(req.body.queryResult))
    next()
  }
}

// //Get Post
// router.post('/inventory/get', async(req,res)=>{

//     const inventory_collection = await InventoryData(req);
//     if (inventory_collection == 'action !== get-inventory-data'){
//       res.send('action !== get-inventory-data');
//     }else{
//       inv = req.body.queryResult.parameters.Inventory
//       inventory_result = await inventory_collection.find({"inventory": `${inv}`}).toArray();
//       inventory_data = JSON.stringify(inventory_result,null,2);
//       req.body.queryResult.fulfillmentText += `\n${inventory_data}`   // Change
//       res.send(req.body.queryResult);
//     }

// })

// TODO: Delete Post
// router.delete('/:id',async(req,res)=>{
//     const fallback = await InventoryData();
//     await fallback.deleteOne({_id:new mongodb.ObjectID(req.params.id)});
//     res.status(200).send();
// })

//Establish the mongodb connection (until collection)
async function InventoryData(req){
    
    if (req.body.queryResult.action === 'get-inventory-data') {
        console.log('action: get-inventory-data');
        try{
          const mongoClient = await mongodb.MongoClient.connect(url,{useNewUrlParser:true});
          return mongoClient.db(mydb).collection(mycollection);
        } catch (err) {
          console.log("error connecting to db...\n", err)
        }
      } else {
        return 'action !== get-inventory-data';
      }

}

exports.getInv = getInv
