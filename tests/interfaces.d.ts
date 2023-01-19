interface WeatherRequestParams {
  latitude: number
  longitude: number
  hourly: string
  start_date: string
  end_date: string
  [key: string]: string | number | boolean
}

interface WeatherResponse {
  status: number
  headers: { [key: string]: string }
  body: {
    latitude: number
    longitude: number
    generationtime_ms: number
    utc_offset_seconds: number
    timezone: string
    timezone_abbreviation: string
    elevation: number
    hourly_units: {
      time: string
      temperature_2m: string
      weathercode: string
      precipitation: string
    }
    hourly: {
      time: string[]
      temperature_2m: number[]
      weathercode: number[]
      precipitation: number[]
    }
  }
}
