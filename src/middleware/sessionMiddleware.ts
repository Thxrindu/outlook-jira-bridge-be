import { Request, Response, NextFunction } from "express";
import { getSession } from "../services/sessionService";
import { JiraSession } from "../models/oauth";

export interface JiraRequest extends Request {
  sessionId: string;
  jiraSession: JiraSession;
}

export function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const auth = req.headers.authorization;
  const jiraReq = req as JiraRequest;

  if (!auth) {
    return res.status(401).json({
      message: "Authorization header missing.",
    });
  }

  const sessionId = auth.replace("Bearer ", "");

  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      message: "Session expired or invalid.",
    });
  }

  jiraReq.sessionId = sessionId;
  jiraReq.jiraSession = session;
  next();
}
