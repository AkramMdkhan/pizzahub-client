// import { betterAuth } from "better-auth";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { nextCookies } from "better-auth/next-js";
// import { MongoClient } from "mongodb";

// const globalForMongo = globalThis as unknown as {
//   mongoClient?: MongoClient;
// };

// const client =
//   globalForMongo.mongoClient ?? new MongoClient(process.env.MONGODB_URI as string);

// if (process.env.NODE_ENV !== "production") {
//   globalForMongo.mongoClient = client;
// }

// const db = client.db(process.env.DB_NAME || "pizzahub");

// export const auth = betterAuth({
//   database: mongodbAdapter(db),
//   emailAndPassword: {
//     enabled: true,
//   },
//   socialProviders: {
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID || "",
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: "string",
//         required: false,
//         defaultValue: "customer",
//         input: true,
//       },
//     },
//   },
//   databaseHooks: {
//     user: {
//       create: {
//         before: async (user) => {
//           // Only "vendor" can be chosen at sign-up. Everything else
//           // becomes "customer". Admin is created manually in the database.
//           const role = (user as { role?: string }).role === "vendor" ? "vendor" : "customer";
//           return { data: { ...user, role } };
//         },
//       },
//     },
//   },
//   plugins: [nextCookies()],
// });



import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ?? new MongoClient(process.env.MONGODB_URI as string);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db(process.env.DB_NAME || "pizzahub");

export const auth = betterAuth({
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
          const role = (user as { role?: string }).role === "vendor" ? "vendor" : "customer";
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