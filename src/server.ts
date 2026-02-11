import express from 'express';
import router from './router';
import { json } from 'express';
import cors from 'cors';
import { corsConfig } from './config/cors';

//Server instance
const app = express();

//Cors configuration
// app.use(cors(corsConfig));

//Dependency for json reading
app.use(json());

//Implementing the router of the endpoints in the app
app.use('/api',router)

export default app;