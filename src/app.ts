import express from 'express';
import resourceRouter from './routes/resource.route';
import authRouter from './routes/auth.route'
import { errorHandler } from './middlewares/error.middleware';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

// parse JSON body
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes
app.use('/', resourceRouter);
app.use('/auth', authRouter)

// global error handler
app.use(errorHandler);

export default app;