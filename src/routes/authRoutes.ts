import { Router } from "express";

import { exchangeToken, restoreSession } from "../controllers/authControllers";

import { sessionMiddleware } from "../middleware/sessionMiddleware";

const router = Router();

router.post("/token", exchangeToken);

router.get("/session", sessionMiddleware, restoreSession);

export default router;
