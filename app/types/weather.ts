export type WeatherResponse = {
  location?: { name?: string };
  timelines?: {
    hourly?: Array<{
      time: string;
      values: {
        temperature?: number;
        humidity?: number;
        weatherCode?: number;
      };
    }>;
  };
};

export type ActionData =
  | { error: string; fieldErrors?: { city?: string } }
  | { data: WeatherResponse };
