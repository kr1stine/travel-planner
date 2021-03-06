import express from "express";
import * as http from "http";
import * as bodyparser from "body-parser";

import cors from "cors";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { FlightsRoutes } from "./flights/flights.routes.config";
import debug from "debug";
import populateData from "./scripts/populateData";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: string = process.env.PORT || "3000";
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

app.use(bodyparser.json());
app.use(cors());

// Init data
// TODO: use actual database
populateData();

routes.push(new FlightsRoutes(app));

app.get("/", (req: express.Request, res: express.Response) => {
  res.status(200).send(`Server up and running!`);
});

server.listen(port, () => {
  debugLog(`Server running at http://localhost:${port}`);
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
});

export default app;
