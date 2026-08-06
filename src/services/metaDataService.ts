import { JiraSession } from "../models/oauth";
import { getProjects, getIssueTypes, getCreateMetadata } from "./jiraService";

// export async function loadJiraConfiguration(
//   sessionId: string,
//   session: JiraSession,
//   projectId: string,
//   issueTypeId: string,
// ) {
//   const projects = await getProjects(sessionId, session);

//   const issueTypes = await getIssueTypes(sessionId, session, projectId);

//   const metadata = await getCreateMetadata(
//     sessionId,
//     session,
//     projectId,
//     issueTypeId,
//   );

//   return {
//     projects: projects.values.map((p: any) => ({
//       id: p.id,
//       name: p.name,
//     })),

//     issueTypes: issueTypes.issueTypes.map((i: any) => ({
//       id: i.id,
//       name: i.name,
//     })),

//     metadata,
//   };
// }

export async function loadJiraConfiguration(
  sessionId: string,
  session: JiraSession,
) {
  const projects = await getProjects(sessionId, session);

  return {
    projects: projects.values.map((project: any) => ({
      id: project.id,

      name: project.name,
    })),
  };
}
