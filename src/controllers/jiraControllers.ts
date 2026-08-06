import { Request, Response } from "express";

import {
  createJiraIssue,
  getCreateMetadata,
  getIssueTypes,
  getProjects,
  loadMetadata,
} from "../services/jiraService";
import { JiraRequest } from "../middleware/sessionMiddleware";
import { loadJiraConfiguration } from "../services/metaDataService";

export async function issueTypes(req: Request, res: Response) {
  try {
    // const { accessToken, cloudId } = req.body;
    const jiraReq = req as JiraRequest;

    const projectId = req.params.projectId as string;

    console.log("projectId", projectId);

    const result = await getIssueTypes(
      jiraReq.sessionId,
      jiraReq.jiraSession,
      projectId,
    );

    res.json(result);
  } catch (error: any) {
    // } catch (error: any) {
    //   console.log("Issue Types Error:", error.response?.data);

    //   res.status(500).json({
    //     message: "Unable to retrieve issue types",

    //     error: error.response?.data,
    //   });
    // }
    console.error("Issue Types Full Error:", error);

    console.error("Message:", error.message);

    console.error("Response:", error.response?.data);

    res.status(500).json({
      message: "Unable to retrieve issue types",

      error: error.message,
    });
  }
}

export async function metadata(req: Request, res: Response) {
  try {
    const jiraReq = req as JiraRequest;

    const projectId = req.params.projectId as string;
    const issueTypeId = req.params.issueTypeId as string;

    console.log("Metadata projectId:", projectId);

    console.log("Metadata issueTypeId:", issueTypeId);

    const result = await getCreateMetadata(
      jiraReq.sessionId,
      jiraReq.jiraSession,
      projectId,
      issueTypeId,
    );

    res.json(result);
  } catch (error: any) {
    console.log("Metadata Error:", error.response?.data);

    res.status(500).json({
      message: "Unable to retrieve metadata",

      error: error.response?.data,
    });
  }
}

export async function createIssue(req: Request, res: Response) {
  try {
    const jiraReq = req as JiraRequest;
    const issueData = req.body;

    const result = await createJiraIssue(
      jiraReq.sessionId,
      jiraReq.jiraSession,
      issueData,
    );

    console.log("jiraReq", jiraReq.jiraSession.cloudId);

    res.json({
      key: result.key,
      self: `${jiraReq.jiraSession.siteUrl}/browse/${result.key}`,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Unable to create Jira issue",
      error: error.response?.data,
    });
  }
}

export async function projects(req: Request, res: Response) {
  try {
    const jiraReq = req as JiraRequest;
    // const { sessionId } = req.body;

    // if (!sessionId) {
    //   return res.status(400).json({
    //     message: "Session ID required",
    //   });
    // }
    // const session = getSession(sessionId);

    // if (!session) {
    //   return res.status(401).json({
    //     message: "Invalid or expired session",
    //   });
    // }

    // const projects = await getProjects(sessionId, session);

    const projects = await getProjects(jiraReq.sessionId, jiraReq.jiraSession);

    return res.json(projects);

    res.json(projects);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Unable to retrieve Jira projects",
    });
  }
}

export async function getMetadata(req: Request, res: Response) {
  try {
    //const session = jiraReq.jiraSession!;
    const jiraReq = req as JiraRequest;

    const metadata = await loadMetadata(jiraReq.sessionId, jiraReq.jiraSession);

    res.json(metadata);
  } catch (error: any) {
    console.error("Metadata Error:", error);

    if (error.response) {
      console.error(error.response.data);
    }

    res.status(500).json({
      message: "Unable to retrieve metadata",

      error: error.response?.data || error.message,
    });
  }
}

export async function configuration(req: Request, res: Response) {
  try {
    const jiraReq = req as JiraRequest;

    const result = await loadJiraConfiguration(
      jiraReq.sessionId,
      jiraReq.jiraSession,
    );

    res.json(result);
  } catch (error: any) {
    console.error("Configuration Error", error.response?.data);

    res.status(500).json({
      message: "Unable to load configuration",
    });
  }
}
