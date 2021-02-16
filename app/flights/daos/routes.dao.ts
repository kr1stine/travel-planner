import debug from "debug";

import { RoutesDto, RouteDto } from "../dto/routes.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class RoutesDao {
  private static instance: RoutesDao;
  routes: RoutesDto = {};

  constructor() {
    log("Created new instance of RoutesDao");
  }

  static getInstance(): RoutesDao {
    if (!RoutesDao.instance) {
      RoutesDao.instance = new RoutesDao();
    }
    return RoutesDao.instance;
  }

  async addRoute(origin: string, route: RouteDto) {
    const originLower = origin.toLowerCase();
    const routesfromOrigin = this.routes[originLower] || [];

    // If route already in array, skip
    if (
      !routesfromOrigin
        .map((r: RouteDto) => r.destination.iata)
        .includes(route.destination.iata)
    ) {
      routesfromOrigin.push(route);
      this.routes[originLower] = routesfromOrigin;
    }
  }

  async getRouteByOrigin(originCode: string) {
    // TODO: if 4-letter code, convert
    return this.routes[originCode.toLowerCase()];
  }

  async getAllRoutes() {
    return this.routes;
  }
}

export default RoutesDao.getInstance();
