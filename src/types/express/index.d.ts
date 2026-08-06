import { JiraSession } from "../../models/types";

declare global {
  namespace Express {
    interface Request {
      sessionId: string;

      jiraSession: JiraSession;
    }
  }
}

export {};
