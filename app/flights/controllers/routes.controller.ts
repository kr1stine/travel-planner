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
    const shortestRoute = await routesService.findShortestRoute(
      req.query.origin?.toString() || "",
      req.query.destination?.toString() || ""
    );
    res.status(200).send(shortestRoute);
  }
}

export default RoutesController.getInstance();
