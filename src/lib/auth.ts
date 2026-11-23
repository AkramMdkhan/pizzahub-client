import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
  mongoConnectPromise?: Promise<MongoClient>;
};

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not set in environment variables.");
}

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = client;
  if (process.env.VERCEL) {
    attachDatabasePool(client);
  }
}

// Kick off connection immediately and share the promise so concurrent requests wait on it
if (!globalForMongo.mongoConnectPromise) {
  globalForMongo.mongoConnectPromise = client.connect().catch((err) => {
    globalForMongo.mongoConnectPromise = undefined;
    console.error("MongoDB connection error in auth:", err);
    throw err;
  });
}

const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://pizzahub-client-beige.vercel.app",
  trustedOrigins: [
    "http://localhost:3000",
    "https://pizzahub-client-beige.vercel.app",
  ],
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      path: "/",
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
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
          const role =
            (user as { role?: string }).role === "vendor" ? "vendor" : "customer";
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