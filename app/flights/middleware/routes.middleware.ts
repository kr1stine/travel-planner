import express from "express";
import routesService from "../services/routes.service";

class RoutesMiddleware {
  private static instance: RoutesMiddleware;

  static getInstance() {
    if (!RoutesMiddleware.instance) {
      RoutesMiddleware.instance = new RoutesMiddleware();
    }
    return RoutesMiddleware.instance;
  }

  async validateRequiredRouteParams(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.query.origin && req.query.destination) {
      next();
    } else {
      res.status(400).send({
        error: `Missing required parameters: origin and/or destination`,
      });
    }
  }

  async validateSameOriginAndDestination(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      req.query.origin?.toString().toLowerCase() !==
      req.query.destination?.toString().toLowerCase()
    ) {
      next();
    } else {
      res.status(400).send({
        error: `Cannot find route between same origin and destination`,
      });
    }
  }

  async validateAirportsExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const origin = req.query.origin;
    const destination = req.query.destination;

    let airportsNotFound: any[] = [];
    [origin, destination].forEach(async (airport) => {
      const dataPoint = await routesService.readByOrigin(req.params.origin);
      if (dataPoint) {
        next();
      } else {
        airportsNotFound.push(airport);
      }
    });

    if (airportsNotFound) {
      res.status(404).send({ error: `Airport ${req.params.origin} not found` });
    }
  }
}

export default RoutesMiddleware.getInstance();
