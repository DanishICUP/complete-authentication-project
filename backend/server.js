import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectdb from './src/config/db.js'
import userRoute from './src/routes/user.route.js'

const app = express()
const port = process.env.PORT || 5001;

connectdb();

const allowOrigins = ['http://localhost:5173']
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowOrigins , credentials:true}))

//routes
app.use('/api/auth',userRoute)


app.listen(port , ()=>{
    console.log(`app listening on port http://localhost:${port}`);
    
})
