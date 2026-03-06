import express from 'express';

// importing from routes and middleware
import branchesRouter from './routes/branches.route.js';
import slotRouter from './routes/slots.route.js';

const app = express();

// Binding all routes and middleware
app.use(express.json()); // Middleware used to parse json 
app.use('/api/branches', branchesRouter);
app.use('/api/slots', slotRouter);

// it is Used to check status of the backend server.
app.get('/health', (req, res)=>{
  res.status(200).json({"status": "ok"});
});

export default app;



