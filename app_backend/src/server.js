import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app.js";
import { initDatabase } from "./config/database.js";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4003;

async function start() {
  try {
    await initDatabase(); // initialize DB and sync models
    const app = await createApp();

    app.listen(PORT, () => {
      console.log(`[app_backend] Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("[app_backend] Failed to start server:", err);
    process.exit(1);
  }
}

start();
