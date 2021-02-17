import debug from "debug";
import { AirportsDto, AirportDto } from "../dto/airport.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class AirportsDao {
  private static instance: AirportsDao;
  airports: AirportsDto = {};

  constructor() {
    log("Created new instance of RoutesDao");
  }

  static getInstance(): AirportsDao {
    if (!AirportsDao.instance) {
      AirportsDao.instance = new AirportsDao();
    }
    return AirportsDao.instance;
  }

  async addAirport(iata: string, airport: AirportDto) {
    iata = iata.toLowerCase();
    this.airports[iata] = airport;
  }

  async getAirportByCode(code: string) {
    code = code.toLowerCase();
    return this.airports[code];

    // return this.airports.find((airport: { iata: string; icao: string }) =>
    //   [airport.iata.toLowerCase(), airport.icao.toLowerCase()].includes(
    //     code.toLowerCase()
    //   )
    // );
  }
}

export default AirportsDao.getInstance();
