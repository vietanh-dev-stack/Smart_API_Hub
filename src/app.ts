import express from 'express';
import resourceRouter from './routes/resource.route';
import authRouter from './routes/auth.route'
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// parse JSON body
app.use(express.json());

// routes
app.use('/', resourceRouter);
app.use('/auth', authRouter)

// global error handler
app.use(errorHandler);

export default app;