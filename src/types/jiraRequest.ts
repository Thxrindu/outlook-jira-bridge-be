import { Request } from "express";
import { JiraSession } from "../models/oauth";

export interface JiraRequest extends Request {
  sessionId: string;

  jiraSession: JiraSession;
}
