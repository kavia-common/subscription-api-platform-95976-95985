import { DataTypes } from "sequelize";

/**
 * Initialize the User model.
 * Fields:
 *  - id (UUID, PK)
 *  - email (unique)
 *  - passwordHash
 *  - plan (enum: normal, premium, ultra)
 */
export function initUserModel(sequelize) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plan: {
        type: DataTypes.ENUM("normal", "premium", "ultra"),
        allowNull: false,
        defaultValue: "normal",
      },
    },
    {
      tableName: "users",
      timestamps: true,
      indexes: [{ unique: true, fields: ["email"] }],
    }
  );

  return User;
}
