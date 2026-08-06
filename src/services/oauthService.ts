import axios from "axios";

import { APP_CONFIG } from "../config/appConfig";
import { JiraSession, JiraTokenResponse } from "../models/oauth";
import { updateSession } from "./sessionService";

export async function exchangeCodeForToken(
  code: string,
  codeVerifier: string,
): Promise<JiraTokenResponse> {
  const response = await axios.post(
    APP_CONFIG.jira.tokenUrl,

    {
      grant_type: "authorization_code",

      client_id: APP_CONFIG.jira.clientId,

      client_secret: APP_CONFIG.jira.clientSecret,

      code,

      redirect_uri: APP_CONFIG.jira.redirectUri,

      code_verifier: codeVerifier,
    },

    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post(APP_CONFIG.jira.tokenUrl, {
    grant_type: "refresh_token",

    client_id: APP_CONFIG.jira.clientId,

    client_secret: APP_CONFIG.jira.clientSecret,

    refresh_token: refreshToken,
  });

  return response.data;
}

export async function getValidAccessToken(
  sessionId: string,
  session: JiraSession,
): Promise<string> {
  const currentTime = Date.now();

  // console.log("session", session);

  // Token still valid
  if (session.expiresAt > currentTime + 60000) {
    return session.accessToken;
  }

  console.log("Jira access token expired. Refreshing...");

  const refreshedToken = await refreshAccessToken(session.refreshToken!);

  const updatedSession: JiraSession = {
    ...session,

    accessToken: refreshedToken.access_token,

    refreshToken: refreshedToken.refresh_token ?? session.refreshToken,

    expiresAt: Date.now() + refreshedToken.expires_in * 1000,
  };

  await updateSession(sessionId, updatedSession);

  console.log("Jira token refreshed successfully.");

  return updatedSession.accessToken;
}

export async function getAccessibleResources(accessToken: string) {
  const response = await axios.get(
    "https://api.atlassian.com/oauth/token/accessible-resources",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,

        Accept: "application/json",
      },
    },
  );

  return response.data;
}

export async function getCurrentJiraUser(accessToken: string, cloudId: string) {
  const response = await axios.get(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/myself`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,

        Accept: "application/json",
      },
    },
  );

  return response.data;
}
