import { fileURLToPath } from "node:url";
import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apis = [
  path.resolve(__dirname, "../routes/*.js"),
  path.resolve(__dirname, "../app.js"),
];

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Subscription API Platform - Backend",
      version: "1.0.0",
      description:
        "API with JWT authentication, user & plan management, and a single endpoint with plan-dependent behavior.",
    },
    servers: [
      {
        url: "{protocol}://{host}:{port}",
        description: "Configured server",
        variables: {
          protocol: { default: "http" },
          host: { default: "localhost" },
          port: { default: process.env.PORT || "4003" },
        },
      },
    ],
    tags: [
      { name: "Auth", description: "User signup and login" },
      { name: "User", description: "User profile" },
      { name: "Plan", description: "Plan management" },
      { name: "Execute", description: "Plan-dependent API behavior" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", description: "UUID of the user" },
            email: { type: "string", format: "email" },
            plan: { type: "string", enum: ["normal", "premium", "ultra"] },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          },
        },
      },
    },
  },
  apis,
});
