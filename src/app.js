import express from 'express';
const app = express();

app.use(express.json()); // Middleware used to parse json 

// it is Used to check status of the backend server.
app.get('/health', (req, res)=>{
  res.status(200).json({"status": "ok"});
});

export default app;



