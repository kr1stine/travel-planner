import debug from "debug";

import { RouteDto } from "../dto/routes.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class RoutesDao {
  private static instance: RoutesDao;
  routes: Array<RouteDto> = [];

  constructor() {
    log("Created new instance of RoutesDao");
  }

  static getInstance(): RoutesDao {
    if (!RoutesDao.instance) {
      RoutesDao.instance = new RoutesDao();
    }
    return RoutesDao.instance;
  }

  async getRouteById(routeId: number) {
    return this.routes.find((route: { id: number }) => route.id === routeId);
  }

  async getRouteByOrigin(originCode: string) {
    return this.routes.find(
      (route: { origin: string }) =>
        route.origin.toLowerCase() === originCode.toLowerCase()
    );
  }
}

export default RoutesDao.getInstance();
