import express from 'express';
import multer from 'multer'; // middleware used to handle form-date 

// importing from routes and middleware
import branchesRouter from './routes/branches.route.js';
import slotRouter from './routes/slots.route.js';
import authRouter from './routes/auth.route.js';

const app = express();
const upload = multer({dest: 'uploads/'}); // stores the file 

// Binding all routes and middleware
app.use(express.json()); // Middleware used to parse json 
app.use(express.urlencoded({extended: true})); 
// app.use(upload.single('file')); // .array() for multiply file

app.use('/api/branches', branchesRouter);
app.use('/api/slots', slotRouter);
app.use('/api/auth', authRouter);

// it is Used to check status of the backend server.
app.get('/health', (req, res)=>{
  res.status(200).json({"status": "ok"});
});

export default app;



