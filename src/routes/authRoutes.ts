import { Router } from "express";

import { exchangeToken } from "..//controllers/authControllers";
import { sessionMiddleware } from "../middleware/sessionMiddleware";

const router = Router();

router.post("/token", exchangeToken);

export default router;
