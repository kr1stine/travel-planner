import routeDao from "../daos/routes.dao";
import { RouteDto } from "../dto/routes.model";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class RoutesService {
  private static instance: RoutesService;

  static getInstance(): RoutesService {
    if (!RoutesService.instance) {
      RoutesService.instance = new RoutesService();
    }
    return RoutesService.instance;
  }

  async readByOrigin(originCode: string) {
    return await routeDao.getRouteByOrigin(originCode);
  }

  async findAllRoutes() {
    return await routeDao.getAllRoutes();
  }
  // Helper functions for findShortestRoute

  // Find next observed origin in upcoming loop
  // based on shortest distance
  findShortestNextOrigin = (
    distances: { [origin: string]: number },
    visited: string[],
    destination: string
  ) =>
    Object.keys(distances).reduce(function (res = destination, obj) {
      return !visited.includes(obj) && (!res || distances[obj] < distances[res])
        ? obj
        : res;
    });

  // Constructs string representation of path
  // e.g. TLL->AMS->LAX
  constructPathString = (
    parents: { [destination: string]: string },
    destination: string,
    origin: string
  ) => {
    let parent = parents[destination];
    let path = [destination, parent];

    while (parent != origin) {
      const newParent = parents[parent];
      path.push(newParent);
      parent = newParent;
    }

    path = path.reverse();

    let pathString = "";
    path.forEach((p) => {
      pathString = pathString
        .concat(p.toUpperCase())
        .concat(p !== destination ? "->" : "");
    });
    log("Found path ", pathString);
    return pathString;
  };

  // Dijkstra
  async findShortestRoute(origin: string, destination: string) {
    let distances: { [origin: string]: number } = { [destination]: Infinity };
    let parents: { [destination: string]: string } = {};
    let visited: string[] = [];

    // Fill origin data for first iteration
    let routesFromOrigin = await this.readByOrigin(origin);
    routesFromOrigin.forEach((route: RouteDto) => {
      distances = {
        ...distances,
        [route.destination.iata.toLowerCase()]: route.distance,
      };
      parents = { ...parents, [route.destination.iata.toLowerCase()]: origin };
    });

    let currentOrigin = this.findShortestNextOrigin(
      distances,
      visited,
      destination
    );

    while (currentOrigin) {
      if (currentOrigin === destination) {
        break;
      }
      const routesFromOrigin = (await this.readByOrigin(currentOrigin)) || [];

      routesFromOrigin.forEach((route: RouteDto) => {
        const routeDestinationCode = route.destination.iata.toLowerCase();
        if (routeDestinationCode === currentOrigin) {
          return;
        }
        const oldDistance = distances[routeDestinationCode];
        const newDistance = distances[currentOrigin] + route.distance;

        if (!oldDistance || newDistance < oldDistance) {
          distances[routeDestinationCode] = newDistance;
          parents[routeDestinationCode] = currentOrigin;
        }
      });

      visited.push(currentOrigin);

      currentOrigin = this.findShortestNextOrigin(
        distances,
        visited,
        destination
      );
    }

    log("Path distance: ", distances[destination]);

    return this.constructPathString(parents, destination, origin);
  }
}

export default RoutesService.getInstance();
