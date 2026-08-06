import axios from "axios";
import { getValidAccessToken } from "../services/oauthService";
import { JiraSession } from "../models/oauth";

export async function jiraClient(sessionId: string, session: JiraSession) {
  // console.log("session in jiraClient", session);
  const accessToken = await getValidAccessToken(sessionId, session);
  // console.log("accessToken in jiraClient", accessToken);

  return axios.create({
    baseURL: `https://api.atlassian.com/ex/jira/${session.cloudId}`,

    headers: {
      Authorization: `Bearer ${accessToken}`,

      Accept: "application/json",

      "Content-Type": "application/json",
    },
  });
}
