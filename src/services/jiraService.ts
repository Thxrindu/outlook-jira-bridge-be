import axios from "axios";
import { jiraClient } from "../client/jiraClient";
import { JiraFieldMetadata, JiraOption } from "../models/jiraTypes";
import { JiraSession } from "../models/oauth";

export async function getIssueTypes(
  sessionId: string,
  session: JiraSession,
  projectId: string,
) {
  const jira = await jiraClient(sessionId, session);

  const response = await jira.get(
    `/rest/api/3/issue/createmeta/${projectId}/issuetypes`,
  );

  return response.data;
}

export async function getCreateMetadata(
  sessionId: string,
  session: JiraSession,
  projectId: string,
  issueTypeId: string,
) {
  const jira = await jiraClient(sessionId, session);

  const response = await jira.get(
    `/rest/api/3/issue/createmeta/${projectId}/issuetypes/${issueTypeId}`,
  );

  return response.data;
}

export async function createJiraIssue(
  sessionId: string,
  session: JiraSession,
  issueData: any,
) {
  try {
    // console.log("I called");
    // console.log("session", session);
    const jira = await jiraClient(sessionId, session);

    console.log("jira in jiraService", jira);

    const jiraPayload = {
      fields: {
        project: {
          id: issueData.projectId,
        },

        issuetype: {
          id: issueData.issueTypeId,
        },

        summary: issueData.referenceNo,

        description: {
          type: "doc",

          version: 1,

          content: [
            {
              type: "paragraph",

              content: [
                {
                  type: "text",
                  text: issueData.reason,
                },
              ],
            },
          ],
        },

        customfield_10044: {
          id: issueData.categoryId,
        },

        customfield_10046: {
          id: issueData.componentId,
        },

        labels: issueData.labels ? [issueData.labels] : [],
      },
    };

    console.log("jiraPayload", jiraPayload);

    const response = await jira.post("/rest/api/3/issue", jiraPayload);

    return response.data;
  } catch (error: any) {
    throw error;
  }
}

export async function getProjects(sessionId: string, session: JiraSession) {
  // console.log("session from jiraService", session);
  const jira = await jiraClient(sessionId, session);

  const response = await jira.get("/rest/api/3/project/search");

  return response.data;
}

export async function loadMetadata(sessionId: string, session: JiraSession) {
  const project = await getProjects(sessionId, session);

  const projectId = project.values[0].id;

  const issueTypes = await getIssueTypes(sessionId, session, projectId);

  const metadata = await getCreateMetadata(
    sessionId,
    session,
    projectId,
    issueTypes.issueTypes[2].id, // hardcoded Story Issue Type
  );

  const fields: JiraFieldMetadata[] = metadata.fields.map((field: any) => {
    let options: JiraOption[] = [];

    if (field.allowedValues) {
      options = field.allowedValues.map((option: any) => ({
        id: option.id,

        value: option.value,
      }));
    }

    return {
      key: field.key,

      name: field.name,

      required: field.required,

      options,
    };
  });

  return {
    projectId,

    projectName: project.values[0].name,

    issueTypes: issueTypes.issueTypes.map((item: any) => ({
      id: item.id,

      value: item.name,
    })),

    fields,
  };
}
