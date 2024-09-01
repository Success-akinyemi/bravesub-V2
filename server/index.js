import express from "express";
import { config } from 'dotenv';
config();
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoute from './routes/web/auth.routes.js'
import fundingRoute from './routes/web/funding.routes.js'
import airtimeRoute from './routes/web/airtime.routes.js'
import dataRoute from './routes/web/data.routes.js'
import userRoute from './routes/web/user.routes.js'
import adminRoute from './routes/web/adminAuth.routes.js'
import electricityRoute from './routes/web/electricity.routes.js'
import cableTvRoute from './routes/web/cableTv.routes.js'

import schedule from 'node-schedule'
import axios from "axios";
import UserModel from "./model/User.js";




const app = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.NEBOUR_URL,
    process.env.CLIENT_URL2,
    process.env.CLIENT_URL3
];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('ORIGIN', origin)

    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },    
    credentials: true,
};

app.use(cors(corsOptions));


const PORT = process.env.PORT || 9000

//Import DB
import './connection/db.js'

/**HTTP get request */
app.get('/', (req, res) => {
    res.status(201).json('Home GET Request')
})

/**ROUTES */
//WEB
app.use('/api/web/auth', authRoute)
app.use('/api/web/funding', fundingRoute)
app.use('/api/web/airtime', airtimeRoute)
app.use('/api/web/data', dataRoute)
app.use('/api/web/user', userRoute)
app.use('/api/web/admin', adminRoute)
app.use('/api/web/electricity', electricityRoute)
app.use('/api/web/cableTv', cableTvRoute)



//WHATSAPP
//import whatsappp
import './routes/whatsapp/whatsapp.js'
//import './routes/whatsapp/textSample.js'

//INSTAGRAM

//CORN JOB
import './corn.js'
// Express route to keep the server alive
app.get('/keep-alive', async (req, res) => {
  try {
    const bookings = await UserModel.find();
    console.log('Total number of bookings:', bookings.length);
    res.status(201).json(`Keep alive Request fun: ${bookings.length}`);
  } catch (error) {
    console.error('Error getting all bookings:', error);
    res.status(500).json('Error');
  }
});


app.listen(PORT, () => {
    console.log(`Server runing on port http://localhost:${PORT}`)
})