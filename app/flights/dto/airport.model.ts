export interface AirportsDto {
  [iata: string]: AirportDto;
}

export interface AirportDto {
  name: string;
  iata: string;
  icao: string;
  lat: number;
  lon: number;
}

export interface IcaoToIata {
  [iata: string]: string;
}
