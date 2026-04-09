import swaggerJsdoc from "swagger-jsdoc";
import { authSwaggerDocs } from "../swagger/auth.swagger";
import { resourceSwaggerDocs } from "../swagger/resource.swagger";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Hub JSON Server API",
      version: "1.0.0",
      description: "API dynamic CRUD với JWT Auth và Audit Log",
    },
    servers: [
      { 
        url: "/" 
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    "./src/routes/*.ts", 
    // file Swagger external
    "./src/swagger/*.ts"
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);