import { Request, Response } from "express";

import {
  exchangeCodeForToken,
  getAccessibleResources,
  getCurrentJiraUser,
  getValidAccessToken,
} from "../services/oauthService";
import { APP_CONFIG } from "../config/appConfig";
import { createSession } from "../services/sessionService";
import { JiraRequest } from "../middleware/sessionMiddleware";
import { getSession } from "../services/sessionService";

export async function exchangeToken(req: Request, res: Response) {
  try {
    const { code, codeVerifier } = req.body;
    const jiraReq = req as JiraRequest;

    const token = await exchangeCodeForToken(code, codeVerifier);

    const resources = await getAccessibleResources(token.access_token);

    const cloudId = resources[0].id;

    const siteUrl = resources[0].url;

    const jiraUser = await getCurrentJiraUser(token.access_token, cloudId);

    if (!token.refresh_token) {
      throw new Error("Refresh token not received from Jira");
    }

    const sessionId = createSession({
      accessToken: token.access_token,

      refreshToken: token.refresh_token,

      cloudId,

      siteUrl,

      expiresAt: Date.now() + token.expires_in * 1000,

      user: jiraUser,
    });

    console.log("sessionId", sessionId);
    console.log("user", jiraUser);

    return res.json({
      sessionId,

      user: jiraUser,
    });
  } catch (error: any) {
    // console.error("OAuth exchange failed", error);

    // return res.status(500).json({
    //   message: "Unable to exchange Jira token",
    // });
    console.error("Status:", error.response?.status);

    console.error("Response Data:");
    console.error(error.response?.data);

    throw error;
  }
}

export async function restoreSession(req: Request, res: Response) {
  try {
    const jiraReq = req as JiraRequest;

    const { sessionId, jiraSession } = jiraReq;

    // This will return the existing token if valid,
    // or refresh it if it has expired.
    const accessToken = await getValidAccessToken(sessionId, jiraSession);

    // Get the latest session after token refresh.
    const updatedSession = getSession(sessionId);

    if (!updatedSession) {
      return res.status(401).json({
        message: "Jira session expired.",
      });
    }

    const jiraUser = await getCurrentJiraUser(
      accessToken,
      updatedSession.cloudId,
    );

    return res.json({
      sessionId,
      user: jiraUser,
    });
  } catch (error: any) {
    console.error("Session restoration failed:", error.response?.data || error);

    return res.status(401).json({
      message: "Jira session expired. Please log in again.",
    });
  }
}
