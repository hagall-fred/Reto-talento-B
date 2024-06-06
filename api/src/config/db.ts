import mongoose from 'mongoose'
import config from './config'

const db = async () =>{
    await mongoose.connect(config.mongoUrl as string).then(() => {
        console.log('Connected Database');
    }).catch((error) => {
        console.log("Error", error);
    })
}


export default db;