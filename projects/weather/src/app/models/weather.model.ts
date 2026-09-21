export interface GeocodeResult {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface DailyForecast {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
}

export interface ForecastResponse {
  current: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
}

export type Unit = 'c' | 'f';