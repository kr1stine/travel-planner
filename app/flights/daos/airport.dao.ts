import debug from "debug";

import { AirportDto } from "../dto/airport.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class AirportsDao {
  private static instance: AirportsDao;
  airports: Array<AirportDto> = [];

  constructor() {
    log("Created new instance of RoutesDao");
  }

  static getInstance(): AirportsDao {
    if (!AirportsDao.instance) {
      AirportsDao.instance = new AirportsDao();
    }
    return AirportsDao.instance;
  }

  async addAirport(route: AirportDto) {
    this.airports.push(route);
  }

  async getAirportById(routeId: number) {
    return this.airports.find((route: { id: number }) => route.id === routeId);
  }

  async getAirportByCode(code: string) {
    return this.airports.find((airport: { iata: string; icao: string }) =>
      [airport.iata.toLowerCase(), airport.icao.toLowerCase()].includes(
        code.toLowerCase()
      )
    );
  }
}

export default AirportsDao.getInstance();