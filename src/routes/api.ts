import { Router, type Request, type Response } from "express";
import type { Cache } from "../services/Cache.js";

/**
 * Creates API routes for managing cache entries.
 * @param cache - An instance of the Cache service
 */
export function createApiRoutes(cache: Cache): Router {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {
    try {
      const keys = cache.keys;
      res.json({ keys });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  router.get("/:key", (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const data = cache.get(key);
      res.json(data);
    } catch (e) {
      console.error(e instanceof Error ? e.message : e);
      res.sendStatus(404);
    }
  });

  router.post("/", (req: Request, res: Response) => {
    try {
      const data = req.body;
      const key = cache.create(data);
      res.status(201).json({ key });
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  router.put("/:key", (req: Request, res: Response) => {
    try {
      const key = req.params.key;
      const data = req.body;

      if (cache.cache.has(key)) {
        const updatedData = cache.update(key, data);
        res.json(updatedData);
      } else {
        const createdData = cache.create(data, key);
        res.status(201).json({ key: createdData });
      }
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  router.delete("/:key", (req: Request, res: Response) => {
    try {
      cache.remove(req.params.key);
      res.sendStatus(204);
    } catch (e) {
      console.error(e instanceof Error ? e.message : e);
      res.status(404).json({ error: "Key not found" });
    }
  });

  router.delete("/", (req: Request, res: Response) => {
    try {
      cache.clear();
      res.sendStatus(204);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  });

  return router;
}
