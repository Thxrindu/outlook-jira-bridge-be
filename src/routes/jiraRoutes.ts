import { RequestHandler, Router } from "express";

import {
  configuration,
  createIssue,
  // currentUser,
  getMetadata,
  issueTypes,
  metadata,
  projects,
} from "../controllers/jiraControllers";

import { sessionMiddleware } from "../middleware/sessionMiddleware";

const router = Router();

// router.post("/user", currentUser);

router.post("/projects", sessionMiddleware, projects);

router.post("/projects/:projectId/issuetypes", sessionMiddleware, issueTypes);

router.post(
  "/projects/:projectId/issuetypes/:issueTypeId/metadata",
  sessionMiddleware,
  metadata,
);

router.post("/issue/create", sessionMiddleware, createIssue);

// router.post("/metadata", getMetadata);
router.post("/metadata", sessionMiddleware, getMetadata);

router.post("/configuration", sessionMiddleware, configuration);

export default router;
