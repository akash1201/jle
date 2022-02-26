import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import env from 'dotenv';
import userRoutes from './Routers/user.js';
import incomeRoutes from './Routers/income.js';
import morgan from 'morgan';

env.config()

const app = express()

if (process.env.NODE_ENV === 'development') {
          app.use(morgan('dev'))
        }

app.use(cors())
app.use(express.json())

await mongoose.connect(process.env.DB_HOST).then(()=>{
          console.log('DB Connected')
})

app.use(`/api/users`, userRoutes);
app.use(`/api/income`, incomeRoutes);


app.listen(3001, console.log('Server started'))