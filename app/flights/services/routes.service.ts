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
    path: Array<{
      origin: string;
      destination: string;
      type: string;
    }>
  ) => {
    let pathString = "";

    for (let i = 0; i < path.length; i++) {
      const element = path[i];
      pathString = pathString
        .concat(element.origin.toUpperCase())
        .concat(element.type == "flight" ? "->" : "=>")
        .concat(i == path.length - 1 ? element.destination : "");
    }

    return pathString;
  };

  // Constructs object representation of path
  // e.g. {
  //  route: [
  //    { origin: "TLL", destination: "ARN", type: "flight" },
  //    { origin: "ARN", destination: "LAX", type: "flight" },
  //  ],
  //}
  constructPathObject = (
    parents: { [destination: string]: { origin: string; type: string } },
    destination: string,
    origin: string
  ) => {
    let parent = parents[destination];
    let path = [
      {
        origin: parent.origin.toUpperCase(),
        destination: destination.toUpperCase(),
        type: parent.type,
      },
    ];
    let newDestination = parent;

    while (parent.origin != origin) {
      const newParent = parents[parent.origin];
      path.push({
        origin: newParent.origin.toUpperCase(),
        destination: newDestination.origin.toUpperCase(),
        type: newParent.type,
      });
      parent = newParent;
      newDestination = newParent;
    }

    path = path.reverse();

    return {
      path,
      pathString: this.constructPathString(path),
    };
  };

  // Dijkstra algorithm
  async findShortestRoute(origin: string, destination: string) {
    return new Promise(async (resolve, reject) => {
      // Keeps track of known distances from origin to each node
      let distances: { [origin: string]: number } = { [destination]: Infinity };
      // For each node, keeps track of their preceding node in the shortest path
      let parents: {
        [destination: string]: { origin: string; type: string };
      } = {};
      let visited: string[] = [];

      // Fill origin data for first iteration
      let routesFromOrigin = (await this.readByOrigin(origin)) || [];
      routesFromOrigin.forEach((route: RouteDto) => {
        distances = {
          ...distances,
          [route.destination.iata.toLowerCase()]: route.distance,
        };
        parents = {
          ...parents,
          [route.destination.iata.toLowerCase()]: {
            origin: origin,
            type: route.type,
          },
        };
      });

      let currentOrigin = this.findShortestNextOrigin(
        distances,
        visited,
        destination
      );

      // Main loop
      while (currentOrigin) {
        // The nature of the algorithm determines that when we reach the destination,
        // we have found the shortest path
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
            parents[routeDestinationCode] = {
              origin: currentOrigin,
              type: route.type,
            };
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

      if (distances[destination] === Infinity) {
        reject({ error: "Path not found" });
      } else {
        resolve(this.constructPathObject(parents, destination, origin));
      }
    });
  }
}

export default RoutesService.getInstance();
