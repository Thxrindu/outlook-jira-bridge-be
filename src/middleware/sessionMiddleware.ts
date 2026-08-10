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

  if (!auth) {
    return res.status(401).json({
      message: "Authorization header missing.",
    });
  }

  if (!auth.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Invalid authorization header.",
    });
  }

  const sessionId = auth.substring(7);

  const session = getSession(sessionId);

  if (!session) {
    return res.status(401).json({
      message: "Session expired or invalid.",
    });
  }

  const jiraReq = req as JiraRequest;

  jiraReq.sessionId = sessionId;
  jiraReq.jiraSession = session;

  next();
}
