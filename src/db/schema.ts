import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccount } from "next-auth/adapters";
import "dotenv/config";
import process from "node:process";

if (process.env.DATABASE_URL === undefined) {
  throw new Error("DATABASE_URL is undefined, define it in .env");
}

const pool = postgres(process.env.DATABASE_URL, { max: 1 });

export const db = drizzle(pool);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ],
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const apiKeys = pgTable("apiKeys", {
  id: text("id")
    .primaryKey()
    .unique()
    .$defaultFn(() => crypto.randomUUID()),
  keySha512: text("keySha512").notNull(),
  last8Chars: text("last8Chars").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  creationDate: timestamp("creationDate", { mode: "date" })
    .notNull()
    .defaultNow(),
  lastAccessedDate: timestamp("lastAccessedDate", { mode: "date" }),
  expireDate: timestamp("expireDate", { mode: "date" }).notNull(),
});
