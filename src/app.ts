import express from 'express';
import resourceRouter from './routes/resource.route';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

// parse JSON body
app.use(express.json());

// routes
app.use('/', resourceRouter);

// global error handler
app.use(errorHandler);

export default app;