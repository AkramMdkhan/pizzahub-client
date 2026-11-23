import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { attachDatabasePool } from "@vercel/functions";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

// Falls back to localhost so a build without the variable does not crash,
// but on Vercel a missing value is reported clearly.
const uri = process.env.MONGODB_URI;
if (!uri && process.env.VERCEL) {
  console.error("MONGODB_URI is not set in the Vercel environment variables.");
}

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri || "mongodb://localhost:27017/pizzahub", {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });

// On Vercel, let the platform close idle connections before a function is suspended
if (process.env.VERCEL) {
  attachDatabasePool(client);
}

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
  ],
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      path: "/",
    },
  },
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
      // Set only by the Express server after a verified Stripe payment.
      // input: false means the browser can never write these fields.
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
          // Only "vendor" can be chosen at sign-up. Everything else
          // becomes "customer". Admin is created manually in the database.
          const role =
            (user as { role?: string }).role === "vendor" ? "vendor" : "customer";
          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (data) => {
          // Profile updates must never change role or subscription fields
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