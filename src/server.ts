import express from 'express';
import router from './router';
import { json } from 'express';

//Server instance
const app = express();

//Dependency for json reading
app.use(json());

//Implementing the router of the endpoints in the app
app.use('/api',router)

export default app;