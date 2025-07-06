import mongoose from "mongoose";
import { connectDB } from "./db.js";

async function setup() {
  await connectDB();
  const client = mongoose.connection.getClient();

  try {
    const db = mongoose.connection.db;
    const command = "collMod";

    if (!db) throw new Error("Database connection Unavailable!");

    await db.command({
      [command]: "users",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["firstName", "username", "email", "password"],
          properties: {
            firstName: {
              bsonType: "string",
              minLength: 2,
              maxLength: 32,
            },
            lastName: {
              bsonType: "string",
              maxLength: 32,
            },
            username: {
              bsonType: "string",
              minLength: 3,
              maxLength: 24,
            },
            email: {
              bsonType: "string",
              maxLength: 64,
            },
            password: {
              bsonType: "string",
              minLength: 6,
              maxLength: 128,
            },
            createdAt: {
              bsonType: "date",
            },
            updatedAt: {
              bsonType: "date",
            },
            __v: {
              bsonType: "int",
            },
          },
          additionalProperties: false,
        },
      },
      validationAction: "error",
      validationLevel: "strict",
    });

    await db.command({
      [command]: "analysis",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId", "foodImageUrl", "selectedDisease", "result"],
          properties: {
            userId: {
              bsonType: "objectId",
            },
            foodImageUrl: {
              bsonType: "string",
            },
            selectedDisease: {
              bsonType: "string",
            },
            result: {
              bsonType: "object",
              required: [
                "afftectedNutrients",
                "recommendation",
                "alternativeSuggestion",
              ],
              properties: {
                afftectedNutrients: {
                  bsonType: "string",
                },
                recommendation: {
                  bsonType: "string",
                },
                alternativeSuggestion: {
                  bsonType: "string",
                },
              },
            },
            createdAt: {
              bsonType: "date",
            },
            __v: {
              bsonType: "int",
            },
          },
          additionalProperties: false,
        },
      },
      validationAction: "error",
      validationLevel: "strict",
    });

    await db.command({
      [command]: "sessions",
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["userId"],
          properties: {
            userId: {
              bsonType: "objectId",
            },
            createdAt: {
              bsonType: "date",
            },
            __v: {
              bsonType: "int",
            },
          },
          additionalProperties: false,
        },
      },
      validationAction: "error",
      validationLevel: "strict",
    });

    console.log("✅ JSON Schema validations applied successfully.");
  } catch (err) {
    console.error("❌ Error applying schema validation:", err);
  } finally {
    await client.close();
  }
}

setup();
