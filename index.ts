import "reflect-metadata"
//import 'express'
import config from './src/config/config';
import swaggerDocument from "./swagger.json";
import { AppDataSource } from "./src/data-source"

import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
//import { ValidateError } from "tsoa";
import cors from 'cors'
import * as swaggerUi from "swagger-ui-express";
import { ValidateError } from "@tsoa/runtime";
import { RegisterRoutes } from './src/routes'

const app = express();
//const swaggerDocument = await import("./swagger.json");

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });


app.use(function errorHandler(
  err: unknown,
  req: ExRequest,
  res: ExResponse,
  next: NextFunction
): ExResponse | void {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
});

// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => console.log(error))

export default app;
