import { db } from "@bovion/db";
import { ResetPasswordEmail, sendEmail, VerifyEmail, WelcomeEmail } from "@bovion/emails";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { env } from "./env";

export const auth = betterAuth({
  appName: "Bovion",
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, { provider: "pg" }),
  user: {
    modelName: "users",
  },
  session: {
    modelName: "sessions",
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Redefinir sua senha — Bovion",
        react: ResetPasswordEmail({ name: user.name, url }),
      });
    },
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        subject: "Confirme seu email — Bovion",
        react: VerifyEmail({ name: user.name, url }),
      });
    },
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  plugins: [
    organization({
      schema: {
        organization: { modelName: "organizations" },
        member: { modelName: "members" },
        invitation: { modelName: "invitations" },
      },
    }),
  ],
});
