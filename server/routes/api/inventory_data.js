const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const mydb= `${process.env.MONGO_DB}`;
const mycollection= `${process.env.MONGO_COLLECTION_INVENTORY}`;
const url = `${process.env.MONGO_URL}`;


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
