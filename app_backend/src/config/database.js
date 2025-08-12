import path from "node:path";
import { Sequelize } from "sequelize";
import { fileURLToPath } from "node:url";
import { initUserModel } from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let sequelize;

/**
 * Initialize Sequelize with SQLite and sync models.
 */
// PUBLIC_INTERFACE
export async function initDatabase() {
  /** Initialize database connection and sync all models. */
  if (sequelize) return sequelize;

  const storage =
    process.env.DB_SQLITE_PATH ||
    path.resolve(__dirname, "../../data.sqlite"); // fallback for local dev

  sequelize = new Sequelize({
    dialect: "sqlite",
    storage,
    logging: false,
  });

  // Initialize models
  initUserModel(sequelize);

  // Sync models
  await sequelize.sync();

  return sequelize;
}

// PUBLIC_INTERFACE
export function getSequelize() {
  /** Get active Sequelize instance. */
  if (!sequelize) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return sequelize;
}
