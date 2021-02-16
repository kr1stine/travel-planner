import { CommonRoutesConfig } from "../common/common.routes.config";
import RoutesController from "./controllers/routes.controller";
import RoutesMiddleware from "./middleware/routes.middleware";
import express from "express";

export class FlightsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "FlightsRoutes");
  }

  configureRoutes() {
    this.app.route(`/route/shortest`).get(
      RoutesMiddleware.validateRequiredRouteParams,
      RoutesMiddleware.validateSameOriginAndDestination,
      // RoutesMiddleware.validateAirportsExists,
      RoutesController.getShortestRoute
    );

    this.app.route(`/route/all`).get(RoutesController.getAllRoutes);

    return this.app;
  }
}
