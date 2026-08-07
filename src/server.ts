// import dotenv from "dotenv";

// dotenv.config();

// import app from "./app";
// import { validateConfig } from "./utils/configValidator";

// import jiraRoutes from "./routes/jiraRoutes";

// validateConfig();

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`Jira Bridge API running on port ${PORT}`);
// });

// app.use("/api/jira", jiraRoutes);

import dotenv from "dotenv";

dotenv.config();

import app from "./app";
import { validateConfig } from "./utils/configValidator";

validateConfig();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("======================================");
  console.log(" Jira Bridge API");
  console.log("======================================");
  console.log(` Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(` Listening on port ${PORT}`);
  console.log("======================================");
});
