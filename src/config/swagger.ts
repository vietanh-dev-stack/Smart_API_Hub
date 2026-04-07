import swaggerJsdoc from "swagger-jsdoc"

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Hub JSON Server API",
      version: "1.0.0",
      description: "API dynamic CRUD với JWT Auth và Audit Log",
    },
    servers: [
      { url: "http://localhost:3000", description: "Local server" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        }
      }
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // path tới file có comment Swagger
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);