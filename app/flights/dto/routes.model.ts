export interface RouteDto {
  id: number;
  origin: {
    iata: string;
    icao: string;
  };
  destination: {
    iata: string;
    icao: string;
  };
  type: "flight" | "self-transfer";
  distance: number;
}
