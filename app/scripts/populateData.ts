import debug from "debug";
import shortid from "shortid";

import airportDao from "../flights/daos/airport.dao";
import flightDao from "../flights/daos/flight.dao";
import routesDao from "../flights/daos/routes.dao";
import { AirportDto } from "../flights/dto/airport.model";
import { FlightDto } from "../flights/dto/flight.model";
import { RouteDto } from "../flights/dto/routes.model";

import { calculateDistance } from "../common/utils";

const fs = require("fs");
const readline = require("readline");
const log: debug.IDebugger = debug("app:in-memory-dao");

const createFlight = (line: string) => {
  const splitLine = line.split(",");
  const newFlight: FlightDto = {
    id: shortid.generate(),
    origin: splitLine[2],
    destination: splitLine[4],
  };
  flightDao.addFlight(newFlight);
};

const createAirport = (line: string) => {
  line = line.split('"').join("");
  const splitLine = line.split(",");
  const iata = splitLine[4];
  const newAirport: AirportDto = {
    name: splitLine[1],
    iata,
    icao: splitLine[5],
    lat: parseFloat(splitLine[6]),
    lon: parseFloat(splitLine[7]),
  };
  airportDao.addAirport(iata, newAirport);
};

async function processLineByLine(
  filename: string,
  handleLine: (line: string) => void
) {
  return new Promise((resolve) => {
    var rd = readline.createInterface({
      input: fs.createReadStream(filename),
      console: false,
    });

    rd.on("line", handleLine);
    rd.on("close", () => resolve(true));
  });
}
const createSelfTransferRoutes = async () => {
  const allAirports = await Object.keys(airportDao.getAllAirports());
  for (let i = 0; i < allAirports.length; i++) {
    const airport1 = await airportDao.getAirportByCode(allAirports[i]);
    for (let j = i; j < allAirports.length; j++) {
      const airport2 = await airportDao.getAirportByCode(allAirports[j]);
      const distance = calculateDistance(
        airport1.lat,
        airport1.lon,
        airport2.lat,
        airport2.lon
      );
      if (distance <= 100) {
        const newRoute: RouteDto = {
          id: shortid.generate(),
          destination: {
            iata: airport2.iata,
            icao: airport2.icao,
          },
          type: "self-transfer",
          distance: distance,
        };
        routesDao.addRoute(allAirports[i], newRoute);
      }
    }
  }
};

const createRoutes = async () => {
  const allFlights = await flightDao.getAllFlights();
  allFlights.forEach(async (flight) => {
    // TODO: iata vs icao
    const originAirport = await airportDao.getAirportByCode(flight.origin);
    const destinationAirport = await airportDao.getAirportByCode(
      flight.destination
    );

    if (!originAirport || !destinationAirport) return;

    const newRoute: RouteDto = {
      id: shortid.generate(),
      destination: {
        //iata: destinationAirport?.iata || "",
        //icao: destinationAirport?.icao || "",
        iata: flight.destination,
        icao: flight.destination,
      },
      type: "flight",
      distance: calculateDistance(
        originAirport.lat,
        originAirport.lon,
        destinationAirport.lat,
        destinationAirport.lon
      ),
    };
    //routesDao.addRoute(originAirport?.iata || "", newRoute);
    routesDao.addRoute(flight.origin || "", newRoute);
  });

  createSelfTransferRoutes();
};

const populateData = async () => {
  Promise.all([
    processLineByLine(`data/routes.dat`, createFlight),
    processLineByLine(`data/airports.dat`, createAirport),
  ]).then((_) => createRoutes());
};

export default populateData;
