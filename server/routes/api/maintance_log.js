const express = require('express');
const mongodb = require('mongodb');

const dotenv = require('dotenv');
dotenv.config();

const mydb= `${process.env.MONGO_DB}`;
const mycollection= `${process.env.MONGO_COLLECTION_MAINTANCE}`;
const url = `${process.env.MONGO_URL}`;

const router = express.Router();

router.get('/test',async(req,res)=>{
  res.send("This is a test meassage.");
  console.log("This is a test meassage.");
})

//Get Post
router.get('', async(req,res)=>{

    const maintance_collection = await ConnectToDB();
    if (maintance_collection == 'error connecting to db...'){
      res.send('error connecting to db...');
    }else{
        var action = req.body.queryResult.action;
        if (action === 'maintance-data-push-to-db'){
          new_entry = PushToDB(req,maintance_collection);

          res.send(`This data entry has been recorded:\n${JSON.stringify( new_entry)}`);

        }
        // planeID_result = req.body.queryResult.parameters.planeID;
        // var plane_id_query={'planeID':`${planeID_result}`};
        // existing_maintance_data = await maintance_collection.findOne(plane_id_query);

        // var current_index = existing_maintance_data['backLog'].length+1;
        // console.log("index:",current_index);

        // var date =  new Date();
        
        // var new_entry ={
        //     'date':`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
        //     'personnel': req.body.queryResult.parameters.personnel,
        //     'defectType': req.body.queryResult.parameters.defectType,
        //     'defectText': req.body.queryResult.parameters.defectText,
        //     'defectiveComponents':req.body.queryResult.parameters.defectiveComponents,
        //     'priority':req.body.queryResult.parameters.priority
        // }

        
        // push_result = await maintance_collection.updateOne(
        //     plane_id_query,
        //     {
        //         $push:{
        //             'backLog': new_entry
        //         }
        //     }
        // );

        // res.send(`This data entry has been recorded:\n${new_entry}`);



    }

})




//Establish the mongodb connection (until collection)
async function ConnectToDB(){

    try{
      const mongoClient = await mongodb.MongoClient.connect(url,{useNewUrlParser:true});
      return mongoClient.db(mydb).collection(mycollection); 
    } catch{
      console.log("error connecting to db...")
      return 'error connecting to db...'
    }
    
}

async function PushToDB(req,maintance_collection){
  
  planeID_result = req.body.queryResult.parameters.planeID;
  var plane_id_query={'planeID':`${planeID_result}`};
  existing_maintance_data = await maintance_collection.findOne(plane_id_query);

  var current_index = existing_maintance_data['backLog'].length+1;
  console.log("index:",current_index);

  var date =  new Date();
  
  var new_entry ={
      // 'date':`${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
      'date': date,
      'personnel': req.body.queryResult.parameters.personnel,
      'defectType': req.body.queryResult.parameters.defectType,
      'defectText': req.body.queryResult.parameters.defectText,
      'defectiveComponents':req.body.queryResult.parameters.defectiveComponents,
      'priority':req.body.queryResult.parameters.priority
  }

  
  push_result = await maintance_collection.updateOne(
      plane_id_query,
      {
          $push:{
              'backLog': new_entry
          }
      }
  );

  return new_entry;
  

}




module.exports = router;

// "parameters": {
//   "planeID": "1",
//   "planeType": "737-400",
//   "personnel":"Cheryl",
//   "defectType":"Engine Issue",
//   "defectText":"MAINT ENTRY DUCT ASSY PN: L9871230AZ IPC 36-12-42-01 ITEM 300B CANNIBALIZED TOSERVICE 2Q-QK7.",
//   "defectiveComponents":["19820","17727"],
//   "priority":"High",
//   "sysany": "test1"
// }
