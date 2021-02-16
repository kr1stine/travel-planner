import debug from "debug";

import { FlightDto } from "../dto/flight.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class FlightDao {
  private static instance: FlightDao;
  flights: Array<FlightDto> = [];

  constructor() {
    log("Created new instance of RoutesDao");
  }

  static getInstance(): FlightDao {
    if (!FlightDao.instance) {
      FlightDao.instance = new FlightDao();
    }
    return FlightDao.instance;
  }

  async getAllFlights() {
    return this.flights;
  }

  async addFlight(flight: FlightDto) {
    this.flights.push(flight);
  }

  async getFlightById(flightId: number) {
    return this.flights.find(
      (flight: { id: number }) => flight.id === flightId
    );
  }

  async getFlightsByOrigin(code: string) {
    return;
  }
}

export default FlightDao.getInstance();
