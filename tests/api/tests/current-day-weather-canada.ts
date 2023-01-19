import { fixture, test } from "testcafe"
import { getWeatherReport } from "../../utils/requests"

fixture("API - Canada's Current Day Weather Forecast").beforeEach(async (t) => {
  const currentDate = new Date().toISOString().split("T")[0]
  t.ctx.params = {
    longitude: 59.0,
    latitude: 26.0,
    hourly: ["temperature_2m", "weathercode", "precipitation"],
    start_date: currentDate,
    end_date: currentDate,
  }
})

test("API returns 200 status code for valid requests", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.status).eql(200)
})

test("API returns correct location", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.longitude).eql(t.ctx.params.longitude)
  await t.expect(response.body.latitude).eql(t.ctx.params.latitude)
})

test("API returns correct timezone", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.utc_offset_seconds).eql(0)
  await t.expect(response.body.timezone).eql("GMT")
  await t.expect(response.body.timezone_abbreviation).eql("GMT")
})

test("API returns temperature in celsius", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly_units.temperature_2m).eql("°C")
})

test("API returns precipitation in millimeters", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly_units.precipitation).eql("mm")
})

test("API returns weathercode in WMO Weather interpretation codes", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly_units.weathercode).eql("wmo code")
})

test("API returns time in correct format", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly_units.time).eql("iso8601")
})

test("API returns correct number of hourly temperatures for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly.temperature_2m.length).eql(24)
})

test("API returns temperatures in correct range for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  const minTemp = Math.min(...response.body.hourly.temperature_2m)
  const maxTemp = Math.max(...response.body.hourly.temperature_2m)
  await t.expect(minTemp).gt(-90)
  await t.expect(maxTemp).lt(90)
})

test("API returns correct number of hourly timestamps for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  const currentDate = t.ctx.params.start_date
  const timestampCount = response.body.hourly.time.filter((timestamp) =>
    timestamp.startsWith(currentDate)
  ).length
  await t.expect(timestampCount).eql(24)
})

test("API returns timestamps in correct range for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  const currentDate = t.ctx.params.start_date
  const timestamps = response.body.hourly.time.filter((timestamp) =>
    timestamp.startsWith(currentDate)
  )
  for (const timestamp of timestamps) {
    const time = new Date(timestamp).getUTCHours()
    await t.expect(time).within(0, 23)
  }
})

test("API returns correct number of hourly weathercode for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly.weathercode.length).eql(24)
})

test("API returns weathercodes in correct range for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  const minCode = Math.min(...response.body.hourly.weathercode)
  const maxCode = Math.max(...response.body.hourly.weathercode)
  await t.expect(minCode).gte(0)
  await t.expect(maxCode).lte(99)
})

test("API returns correct number of hourly precipitation for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  await t.expect(response.body.hourly.precipitation.length).eql(24)
})

test("API returns precipitation numbers in correct range for current day", async (t) => {
  const response = await getWeatherReport(t.ctx.params)
  const minPercipitation = Math.min(...response.body.hourly.weathercode)
  const maxPercipitation = Math.max(...response.body.hourly.weathercode)
  await t.expect(minPercipitation).gte(0)
  await t.expect(maxPercipitation).lte(500)
})
