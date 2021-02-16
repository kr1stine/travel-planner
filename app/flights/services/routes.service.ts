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

  // Dijkstra
  async findShortestRoute(origin: string, destination: string) {
    let distances: { [origin: string]: number } = { [destination]: Infinity };
    let parents: { [destination: string]: string } = {};
    let visited: string[] = [];

    // Helper function
    // Used to find next observed origin in upcoming loop
    const findShortestDistance = (
      distances: { [origin: string]: number },
      visited: string[]
    ) =>
      Object.keys(distances).reduce(function (res = destination, obj) {
        return !visited.includes(obj) &&
          (!res || distances[obj] < distances[res])
          ? obj
          : res;
      });

    // Fill origin data for first iteration
    let routesFromOrigin = await this.readByOrigin(origin);
    routesFromOrigin.forEach((route: RouteDto) => {
      distances = {
        ...distances,
        [route.destination.iata.toLowerCase()]: route.distance,
      };
      parents = { ...parents, [route.destination.iata.toLowerCase()]: origin };
    });

    let currentOrigin = findShortestDistance(distances, visited);

    while (currentOrigin) {
      log("Olen tsüklis, currentOrigin ", currentOrigin);
      if (currentOrigin === destination) {
        break;
      }
      const routesFromOrigin = await this.readByOrigin(currentOrigin);

      routesFromOrigin.forEach((route: RouteDto) => {
        const routeDestinationCode = route.destination.iata.toLowerCase();
        if (routeDestinationCode === currentOrigin) {
          return;
        }
        const oldDistance = distances[routeDestinationCode];
        const newDistance = distances[currentOrigin] + route.distance;

        if (!oldDistance || newDistance < oldDistance) {
          log("Tuvastasin, et uut d vaja ", newDistance);
          log("Route on ", route);
          distances[routeDestinationCode] = newDistance;
          parents[routeDestinationCode] = currentOrigin;
        }
      });

      visited.push(currentOrigin);

      currentOrigin = findShortestDistance(distances, visited);
    }

    log("Jõudsin lõppu, distance: ", distances[destination]);
    log("Jõudsin lõppu, parent: ", parents[destination]);
  }
}

export default RoutesService.getInstance();

// track distances from the start node using a hash object

// track paths using a hash object

// collect visited nodes

// find the nearest node

// for that node:

// find its child nodes

// for each of those child nodes:

// make sure each child node is not the start node

// save the distance from the start node to the child node

// if there's no recorded distance from the start node to the child node in the distances object

// or if the recorded distance is shorter than the previously stored distance from the start node to the child node
// save the distance to the object

// record the path

// move the current node to the visited set

// move to the nearest neighbor node

// when the end node is reached, reverse the recorded path back to the start node

//this is the shortest path

// return the shortest path & the end node's distance from the start node
