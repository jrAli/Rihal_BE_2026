import express from 'express';
import multer from 'multer'; // middleware used to handle form-date 

// importing from routes and middleware
import branchesRouter from './routes/branches.route.js';
import slotRouter from './routes/slots.route.js';
import authRouter from './routes/auth.route.js';
import appointmentRouter from './routes/appointment.route.js';

const app = express();
const upload = multer({dest: 'uploads/'}); // stores the file 

// Binding all routes and middleware
app.use(express.json()); // Middleware used to parse json 
app.use(express.urlencoded({extended: true})); 

app.use('/api/branches', branchesRouter);
app.use('/api/slots', slotRouter);
app.use('/api/auth', authRouter);
app.use('/api/appointments', appointmentRouter);

// Error handling for multer
app.use((err, req, res, next)=>{
  if (err instanceof multer.MulterError || err) 
    return res.status(400).json({error: err.message});
});

// it is Used to check status of the backend server.
app.get('/health', (req, res)=>{
  res.status(200).json({"status": "ok"});
});

export default app;



