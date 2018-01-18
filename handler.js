'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const s3 = new AWS.S3({
  region:"us-east-1",
  accessKeyId: "AKIAIJ6YIO6BONJI637Q",
  secretAccessKey:"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"
});

module.exports.extractMetadata = (event, context, callback) => {
 
 const bucket = event.Records[0].s3.bucket.name;
 const key = event.Records[0].s3.object.key;
 const params = {Bucket: bucket, Key: key};
 const array= key.split("\/");
 
 s3.getObject(params, function(err, data) {
  if (err) console.log("Erro",err, err.stack); // an error occurred
  else      
  dynamoPersist(data,array[1])
     
 });
};

function dynamoPersist(data, pk){
 const timestamp = new Date().getTime();
 const params = {
   Key: {
       s3objectkey:pk
   },
   TableName: "serverless-challenge-dev",
   UpdateExpression: "set size = :s, ContentType = :ct, lastUpdate = :lu",
   ExpressionAttributeValues:{
     ":s":data.ContentLength,
     ":ct":data.ContentType,
     ":lu":timestamp
       
   },
   ReturnValues:"UPDATED_NEW"
 };
 
 dynamoDb.update(params, function(err, data) {
    if (err) console.log(err);
    else console.log("Ok");
 });   
}

module.exports.getMetadata = (event, context, callback) => {
  const params = {
    TableName: "serverless-challenge-dev",
    Key: event.pathParameters,
  };

  // fetch  from the database
  dynamoDb.get(params, (error, result) => {
    if (error) {
     console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};

module.exports.getImage = (event, context, callback) => {
  const key = "uploads/"+event.pathParameters.s3objectkey;
 const params = {
    Bucket: "instagrao-images",
    Key: key
  }
 
 
 s3.getObject(params, function(err, data) {
  
   if (err) {
     console.error(err);
      callback(null, {
        statusCode: err.statusCode || 501,
        headers: { 'Content-Type': 'application/json' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }
    
  
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data),
    };
    
    
    callback(null, response);
  
     
 });
};
