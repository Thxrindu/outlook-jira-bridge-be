// import express from "express";
// import cors from "cors";
// import authRoutes from "./routes/authRoutes";
// import { APP_CONFIG } from "./config/appConfig";

// const app = express();

// app.use(cors());

// app.use(express.json());

// app.use("/api/auth", authRoutes);

// app.get("/api/health", (_, res) => {
//   res.json({
//     status: "Running",

//     service: "Jira Bridge API",
//   });
// });

// export default app;

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import jiraRoutes from "./routes/jiraRoutes";
import { APP_CONFIG } from "./config/appConfig";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header
      // (Postman, server-to-server calls, health checks, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (APP_CONFIG.allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin '${origin}' is not allowed by CORS`));
    },

    methods: ["GET", "POST"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jira", jiraRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    status: "Running",
    service: "Jira Bridge API",
    environment: APP_CONFIG.environment,
  });
});

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  },
);

export default app;
