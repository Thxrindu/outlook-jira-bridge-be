import { Request, Response } from "express";

import {
  exchangeCodeForToken,
  getAccessibleResources,
  getCurrentJiraUser,
} from "../services/oauthService";
import { APP_CONFIG } from "../config/appConfig";
import { createSession } from "../services/sessionService";
import { JiraRequest } from "../middleware/sessionMiddleware";

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

// export async function currentUser(req: Request, res: Response) {
//   try {
//     //const { accessToken, cloudId } = req.body;
//     const jiraReq = req as JiraRequest;

//     const user = await getCurrentJiraUser(
//       jiraReq.sessionId,
//       jiraReq.jiraSession,
//     );
//     res.json(user);
//   } catch (error: any) {
//     console.log("Jira API Error:");
//     console.log(error.response?.data);
//     console.log(error.response?.status);
//     res.status(500).json({
//       message: "Unable to retrieve Jira user",
//       error: error.response?.data,
//     });
//   }
// }
