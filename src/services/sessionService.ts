import { JiraSession } from "../models/oauth";

const sessions = new Map<string, JiraSession>();

export function createSession(session: JiraSession) {
  const sessionId = crypto.randomUUID();

  sessions.set(sessionId, session);

  return sessionId;
}

export function getSession(sessionId: string) {
  return sessions.get(sessionId);
}

export function updateSession(sessionId: string, session: JiraSession) {
  sessions.set(sessionId, session);
}
