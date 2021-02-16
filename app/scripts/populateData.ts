import airportDao from "../flights/daos/airport.dao";
import flightDao from "../flights/daos/flight.dao";
import routesDao from "../flights/daos/routes.dao";
import { AirportDto } from "../flights/dto/airport.model";
import { FlightDto } from "../flights/dto/flight.model";
import { RouteDto } from "../flights/dto/routes.model";
import debug from "debug";

const fs = require("fs");
const readline = require("readline");
const log: debug.IDebugger = debug("app:in-memory-dao");

const createFlight = (line: string) => {
  const splitLine = line.split(",");
  const newFlight: FlightDto = {
    id: 1,
    origin: splitLine[2],
    destination: splitLine[4],
  };
  flightDao.addFlight(newFlight);
};

const createAirport = (line: string) => {
  const splitLine = line.split(",");
  const newAirport: AirportDto = {
    id: 1,
    name: splitLine[1],
    iata: splitLine[4],
    icao: splitLine[5],
    latitude: parseFloat(splitLine[6]),
    longitude: parseFloat(splitLine[7]),
  };
  airportDao.addAirport(newAirport);
};

async function processLineByLine(
  filename: string,
  handleLine: (line: string) => void
) {
  var rd = readline.createInterface({
    input: fs.createReadStream(filename),
    console: false,
  });

  rd.on("line", handleLine);
  rd.on("close", createRoutes);
}

const createRoutes = async () => {
  const allFlights = await flightDao.getAllFlights();
  allFlights.forEach(async (flight) => {
    // TODO: iata vs icao
    //const originAirport = await airportDao.getAirportByCode(flight.origin);
    // const destinationAirport = await airportDao.getAirportByCode(
    //   flight.destination
    // );

    const newRoute: RouteDto = {
      destination: {
        //iata: destinationAirport?.iata || "",
        //icao: destinationAirport?.icao || "",
        iata: flight.destination,
        icao: flight.destination,
      },
      type: "flight",
      distance: 10,
    };
    //routesDao.addRoute(originAirport?.iata || "", newRoute);
    routesDao.addRoute(flight.origin || "", newRoute);
  });
};

const populateData = async () => {
  processLineByLine(`data/routes.dat`, createFlight);
  processLineByLine(`data/airports.dat`, createAirport);
};

export default populateData;
