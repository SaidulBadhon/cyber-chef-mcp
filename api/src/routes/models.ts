import { Hono } from "hono";
import { getAvailableModels } from "../services/ai";

const models = new Hono();

models.get("/", (c) => {
  return c.json(getAvailableModels());
});

export default models;
