import mongoose from "mongoose";

const conectDB = async () => {
    try {
       const db =  await mongoose.connect(process.env.MONGO_URL)

       const url = `${db.connection.host}:${db.connection.port}`
       console.log(`MongoDB conectado en: ${url}`)
    } catch (error) {
        console.log(`error: ${error}`)
        process.exit(1)
    }
}

export default conectDB;