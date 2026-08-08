import dotenv from "dotenv";

dotenv.config();

export const APP_CONFIG = {
  port: Number(process.env.PORT) || 3001,

  jira: {
    clientId: process.env.JIRA_CLIENT_ID || "",

    clientSecret: process.env.JIRA_CLIENT_SECRET || "",

    redirectUri: process.env.JIRA_REDIRECT_URI || "",

    authUrl: process.env.JIRA_AUTH_URL || "",

    tokenUrl: process.env.JIRA_TOKEN_URL || "",

    apiBaseUrl: process.env.JIRA_API_BASE_URL || "",
  },
  environment: process.env.NODE_ENV || "development",

  apiUrl: process.env.API_URL || "http://localhost:3001",

  allowedOrigins:
    process.env.NODE_ENV === "production"
      ? ["https://thxrindu.github.io"]
      : ["https://localhost:3000"],
};
