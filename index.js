import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import conectDB from './config/db.js';
import worldmap from './routes/worldmap.js'

const app = express();
const PORT = 3000;

app.use(express.json())

dotenv.config()
conectDB();



//cors
// const domainsAllowed = [process.env.FRONTEND_URL]

// const corsConfig = {
//     origin: function(origin, callback){
//         if(domainsAllowed.indexOf(origin) !== -1){
//             callback(null, true)
//         }
//         else{
//             callback(new Error("Access Blocked"))
//         }
//     }
// }

app.use(cors({
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
}));

app.use('/worldmap', worldmap)


app.listen(PORT, ()=> {
    console.log(`Servidor ejecutandose en ${PORT}`)
})