import { t } from "testcafe"

const API_URL = "https://api.open-meteo.com/v1/forecast"

export const getWeatherReport = async (params: WeatherRequestParams) => {
  const response = await t.request.get({
    url: API_URL,
    params,
  })
  return response as WeatherResponse
}
