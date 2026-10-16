const server = require('./app')
const redis = require('./redis')
const mongoose = require('mongoose')
const config = require('./config.app')


const startSever = async()=>{
    mongoose.connect(config.mongoDb.mongoUri)
        .then(()=>{
            console.log('connect to database is successFully');
            
        })
        .catch((error)=>{
            console.log('error -> \n', error);
            
        })
    redis.ping()
        .then(()=>{
            console.log('connect to redis sucessfully');
            
        })
        .catch((error)=>{
            console.log('error -> \n',  error);
            
        })
    server.listen(+config.server.port, ()=>{
        console.log('srver is runing');
        
    })
}


startSever()