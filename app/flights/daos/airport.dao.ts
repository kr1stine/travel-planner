import debug from "debug";

import { IcaoToIata } from "../dto/airport.model";
import { AirportsDto, AirportDto } from "../dto/airport.model";

const log: debug.IDebugger = debug("app:in-memory-dao");

class AirportsDao {
  private static instance: AirportsDao;
  airports: AirportsDto = {};
  icaoToIata: IcaoToIata = {};

  constructor() {
    log("Created new instance of RoutesDao");
  }

  static getInstance(): AirportsDao {
    if (!AirportsDao.instance) {
      AirportsDao.instance = new AirportsDao();
    }
    return AirportsDao.instance;
  }

  async getAllAirports() {
    return this.airports;
  }

  async addAirport(iata: string, airport: AirportDto) {
    iata = iata.toLowerCase();
    this.airports[iata] = airport;
  }

  async addIcaoToIataMapping(icao: string, iata: string) {
    icao = icao.toLowerCase();
    iata = iata.toLowerCase();
    this.icaoToIata[icao] = iata;
  }

  async getIataByIcao(icao: string) {
    icao = icao.toLowerCase();
    return this.icaoToIata[icao];
  }

  async getAirportByCode(code: string) {
    code = code.toLowerCase();
    return this.airports[code];
  }
}

export default AirportsDao.getInstance();
