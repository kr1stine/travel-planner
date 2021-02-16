import routeDao from "../daos/routes.dao";
import { RouteDto } from "../dto/routes.model";

class RoutesService {
  private static instance: RoutesService;

  static getInstance(): RoutesService {
    if (!RoutesService.instance) {
      RoutesService.instance = new RoutesService();
    }
    return RoutesService.instance;
  }

  async readById(id: number) {
    return await routeDao.getRouteById(id);
  }

  async readByOrigin(originCode: string) {
    return await routeDao.getRouteByOrigin(originCode);
  }

  async findAllRoutes() {
    // TODO: logic
    //return await routeDao.findShortestRoute(origin, destination);
    return await routeDao.getAllRoutes();
  }

  async findShortestRoute(origin: string, destination: string) {
    // TODO: logic
    //return await routeDao.findShortestRoute(origin, destination);
    return await routeDao.getRouteByOrigin(origin);
  }
}

export default RoutesService.getInstance();
