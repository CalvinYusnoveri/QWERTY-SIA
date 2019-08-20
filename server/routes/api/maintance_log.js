const mongodb = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

const mydb= `${process.env.MONGO_DB}`;
const mycollection= `${process.env.MONGO_COLLECTION_MAINTANCE}`;
const url = `${process.env.MONGO_URL}`;


async function maintance_push_or_get(req, res, next){
  if (req.body.queryResult.action === 'maintance-data-push-to-db') {
    console.log('action === maintance-data-push-to-db')

    const maintance_collection = await ConnectToDB();
    if (maintance_collection == 'error connecting to db...'){
      req.body.queryResult['fulfillmentText'] = 'error connecting to db...';
      next()
    }else{
          new_entry = await PushToDB(req,maintance_collection);
          req.body.queryResult['fulfillmentText'] =`${JSON.stringify(new_entry,null,2)}`;
          console.log('New entry:')
          console.log(new_entry)
          next()
    }
  }else if(req.body.queryResult.action === 'maintance-data-get-from-db'){
    console.log('action === maintance-data-get-from-db')
    const maintance_collection = await ConnectToDB();
    if (maintance_collection == 'error connecting to db...'){
      req.body.queryResult['fulfillmentText'] = 'error connecting to db...';
      next()
    }else{
          query_result = await GetFromDB(req,maintance_collection);
          if (query_result === null){
            query_result = 'No such plane id :(';
            console.log('No such plane id :(')
          }else{
            req.body.queryResult['fulfillmentText'] =`${JSON.stringify(query_result,null,2)}`;
            console.log('Query result:')
            console.log(query_result)
          }
          next()
    }


  }else{
    console.log('action !== maintance-data')
    next()
  }

}




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
      'date':`${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`,
      // 'date': date,
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

async function GetFromDB(req,maintance_collection){
  planeID_result = req.body.queryResult.parameters.planeID
  var plane_id_query={'planeID':`${planeID_result}`};
  existing_maintance_data = await maintance_collection.findOne(plane_id_query);
  return existing_maintance_data
}



exports.maintance_push_or_get = maintance_push_or_get;

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
