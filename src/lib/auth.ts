import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

// 1. Added a fallback URI to prevent build-time crashes if the env var is missing
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/pizzahub";

const client = globalForMongo.mongoClient ?? new MongoClient(uri);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
  // 2. Added fallback for the base URL
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://pizzahub-client-so2v.vercel.app",
  ],
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const role = (user as { role?: string }).role === "vendor" ? "vendor" : "customer";
          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (data) => {
          const safe = { ...(data as Record<string, unknown>) };
          delete safe.role;
          delete safe.subscriptionPlan;
          delete safe.subscriptionExpiresAt;
          return { data: safe };
        },
      },
    },
  },
  plugins: [nextCookies()],
});