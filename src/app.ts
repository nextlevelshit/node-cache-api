import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { createApiRoutes } from "./routes/api.js";
import { Html } from "./services/Html.js";
import type { Cache } from "./services/Cache.js";

export interface AppOptions {
  port: string | number | undefined;
}

/**
 * Creates an Express application with API routes and static HTML serving.
 * @param cache - An instance of the Cache service for managing data
 * @param options - Optional configuration options for the app
 */
export function createApp(cache: Cache, options: AppOptions): Express {
  const app = express();

  // Remove x-powered-by header
  app.disable("x-powered-by");
  // Enable cors
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.header("Cache-Control", "no-cache");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  // Enable JSON parsing for incoming requests
  app.use(express.json());
  // Add routes for API endpoints
  app.use("/api", createApiRoutes(cache));
  // Static HTML route
  app.get("/", (req: Request, res: Response) => {
    const html = new Html({ debug: process.env.NODE_ENV === "development" });

    try {
      const content = html.render("../../index.html", {
        PORT: options.port,
      });
      res.send(content);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Template rendering failed:", message);
      res.status(500).send("Internal Server Error");
    }
  });

  return app;
}
