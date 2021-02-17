import express from "express";

import routesService from "../services/routes.service";

import debug from "debug";

const log: debug.IDebugger = debug("app:routes-controller");

class RoutesController {
  private static instance: RoutesController;

  static getInstance(): RoutesController {
    if (!RoutesController.instance) {
      RoutesController.instance = new RoutesController();
    }
    return RoutesController.instance;
  }

  async getAllRoutes(req: express.Request, res: express.Response) {
    const routes = await routesService.findAllRoutes();
    res.status(200).send(routes);
  }

  async getShortestRoute(req: express.Request, res: express.Response) {
    routesService
      .findShortestRoute(
        req.query.origin?.toString().toLowerCase() || "",
        req.query.destination?.toString().toLowerCase() || ""
      )
      .then(
        (value) => {
          res.status(200).send(value);
        },
        (reason) => {
          res.status(500).send(reason);
        }
      );
  }
}

export default RoutesController.getInstance();
