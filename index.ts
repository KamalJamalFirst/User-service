import 'reflect-metadata';
import express, { Response as ExResponse, NextFunction } from 'express';
import cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import { ValidateError } from '@tsoa/runtime';
import { RegisterRoutes } from './routes';
import swaggerDocument from "./swagger.json";
import { AppDataSource } from './src/data-source';
import config from './src/config/config';


// 1. Initialize the Express app
const app = express();

// 2. Define all general middleware
app.use(cors());
app.use(express.json());


// 3. Define all routes (including TSOA's)
// app.use('/docs', swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
//     return res.send(
//         swaggerUi.generateHTML(await import('./swagger.json'))
//     );
// });

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// The TSOA routes must be registered here
RegisterRoutes(app);
// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`);
// });

// 4. Define all error-handling middleware
app.use(function errorHandler(
    err: unknown,
    //req: ExRequest,
    res: ExResponse,
    next: NextFunction
): ExResponse | void {
    if (err instanceof ValidateError) {
        return res.status(422).json({
            message: 'Validation Failed',
            details: err?.fields,
        });
    }
    if (err instanceof Error) {
        return res.status(500).json({
            message: 'Internal Server Error',
        });
    }
    next();
});


// 5. Initialize the database and then start the server
// This ensures the database connection is ready before you accept requests.

// AppDataSource.initialize().catch((error: any) => console.log(error))

AppDataSource.initialize()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch((error) => console.log('Database initialization failed:', error));


export default app;