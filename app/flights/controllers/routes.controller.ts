import express from "express";

import routesService from "../services/routes.service";

import debug from "debug";
import airportDao from "../daos/airport.dao";

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
    const getCode = async (argumentName: string): Promise<string> => {
      let queryCode = req.query[argumentName]?.toString().toLowerCase() || "";

      // For simplicity, all data is indexed by iata codes
      return queryCode.length === 4
        ? await airportDao.getIataByIcao(queryCode)
        : queryCode;
    };
    let originCode = await getCode("origin");
    let destinationCode = await getCode("destination");

    routesService.findShortestRoute(originCode, destinationCode).then(
      (value) => {
        res.status(200).send(value);
      },
      (reason) => {
        res.status(404).send(reason);
      }
    );
  }
}

export default RoutesController.getInstance();
