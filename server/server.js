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




const app = express()
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const corsOptions = {
    origin: `${process.env.CLIENT_URL}`,
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




//WHATSAPP
//import whatsappp
import './routes/whatsapp/whatsapp.js'

//INSTAGRAM

app.listen(PORT, () => {
    console.log(`Server runing on port http://localhost:${PORT}`)
})