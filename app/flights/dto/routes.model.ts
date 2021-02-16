export interface RoutesDto {
  [origin: string]: Array<RouteDto>;
}

export interface RouteDto {
  id: string;
  destination: {
    iata: string;
    icao: string;
  };
  type: "flight" | "self-transfer";
  distance: number;
}
