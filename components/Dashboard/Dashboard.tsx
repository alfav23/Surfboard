"use client"
import { useState } from "react";
import {Chart} from "react-google-charts";
import styles from "./Dashboard.module.scss";
import { fetchWeatherApi } from 'openmeteo';

export default function Dashboard() {

    // const [weatherData, setWeatherData] = useState<any>([]);
    const [loc, setLoc] = useState<any>([]); 
    const [windSpeedData, setWindSpeedData] = useState<any>([]);
    const [windDirectionData, setWindDirectionData] = useState<any>([]);
    const [visData, setVisData] = useState<any>([]);
    const [rainData, setRainData] = useState<any>([]);

    const fetchLocationData = async(e: any, loc: any) => {
        e.preventDefault();
        try {
            const url = `https://geocoding-api.open-meteo.com/v1/search?name=${loc}&count=10&language=en&format=json&countryCode=US`;
            const response = await fetch(url);

            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const { latitude, longitude } = data.results[0];
                fetchWeatherData(latitude, longitude);
            } else {
                throw new Error('City not found');
            }
        } catch (error) {
            console.error('Could not retrieve location:', error);
            return null;
        }
    }

    const fetchWeatherData = async(lat: any, long: any) => {
        const params = {
            latitude: [lat],
            longitude: [long],
            current: 'temperature_2m,precipitation,rain,snowfall,wind_speed_10m,wind_direction_10m',
            hourly: 'temperature_2m,visibility,rain,snowfall,wind_speed_10m,wind_direction_10m',
            hourly_units: {
                "temperature_2m": "°F",
                "rain": "inch",
                'snowfall': "inch",
                "wind_speed_10m": "mph"
            },
            daily: 'weather_code,temperature_2m_max,temperature_2m_min',
            forecast_days: 1,
        };

        const url = 'https://api.open-meteo.com/v1/forecast';
        const responses = await fetchWeatherApi(url, params);

         // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];

        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const current = response.current()!;
        const hourly = response.hourly()!;
        const daily = response.daily()!;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
            current: {
                time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
                temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()
                windSpeed: current.variables(2)!.value(),
                windDirection: current.variables(3)!.value()
            },

            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                    ),
                temperature: hourly.variables(0)!.valuesArray()!, // `.valuesArray()` get an array of floats
                visibility: hourly.variables(1)!.valuesArray()!,
                rain: hourly.variables(2)!.valuesArray()!,
                snowfall: hourly.variables(3)!.valuesArray()!,
                windSpeed: hourly.variables(4)!.valuesArray()!,
                windDirection: hourly.variables(5)!.valuesArray()!,
            },
                
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperatureMax: daily.variables(1)!.valuesArray()!,
                temperatureMin: daily.variables(2)!.valuesArray()!,
            }
        };

        // `weatherData` now contains a simple structure with arrays for datetime and weather data
        const time = weatherData.hourly.time;
        const windSpeed = weatherData.hourly.windSpeed;
        const windDirection = weatherData.hourly.windDirection;
        const visibility = weatherData.hourly.visibility;
        const snowfall = weatherData.hourly.snowfall;
        const rain = weatherData.hourly.rain;

        let tempWindSpeedData: (string | number)[][] = [
            ["Hour", "Speed"],
        ];

        let tempWindDirectionData: (string | number)[][] = [
            ["Hour", "Direction"],
        ];

        let tempVisData: (string | number)[][] = [
            ["Time of Day", "Distance"],
        ];

        let tempRainData: (string | number)[][] = [
            ["Time of Day", "Rain", "Snow"],
        ];

        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            tempVisData.push([i, visibility[i]]);
            tempWindSpeedData.push([i, windSpeed[i]]);
            tempWindDirectionData.push([i, windDirection[i]]);
            tempRainData.push([i, rain[i], snowfall[i]]);

            console.log(
                time[i], 
                `${windSpeed[i]}mph`, 
                `${windDirection[i]}°`,
                `${visibility[i]}meters`,
                `${snowfall[i]} inches`,
                `${rain[i]} inches`,
                );
            }

            setWindSpeedData(tempWindSpeedData);
            setWindDirectionData(tempWindDirectionData);
            setVisData(tempVisData);
            setRainData(tempRainData);
        };

    // wind speed
        const windSpeedOptions = {
            title: 'Wind Speed',
            curveType: 'function',
            vAxis: {
                title: "Speed (mph)",
                minValue: 0
            },
            hAxis: {
                title: "Time",
                minValue: 0,
                maxValue: 23
            },
            legend: {
                position: 'bottom'
            }
        };

        //wind direction
        const windDirectionOptions = {
            title: 'Wind Direction',
            vAxis: {
                title: "Degrees (out of 360)",
                minValue: 0
            },
            hAxis: {
                title: "Time",
                minValue: 0,
                maxValue: 23
            },
            legend: {
                position: 'bottom'
            }
        };

        // N  = 0 / 360 deg
        // NE = 45 deg
        // E = 90 deg
        // SE = 135 deg
        // S = 180 deg
        // SW = 225 deg
        // W = 270 deg
        // NW = 315 deg
        // // West (W) covers the range from approximately 258.75° to 281.25°

    // visibility
        const visOptions = {
            title: 'Visibility',
            vAxis: {
                title: "Distance (Meters)",
                minValue: 0,
            },
            hAxis: {
                title: "Time",
                minValue: 0,
                maxValue: 23
            },
            legend: {
                position: 'bottom'
            }
        };

    // rain
        const rainOptions = {
            title: 'Precipitation',
            vAxis: {
                title: "Inches",
                minValue: 0
            },
            hAxis: {
                title: "Hour",
                minValue: 0,
                maxValue: 23
            },
            legend: {
                position: 'bottom'
            }
        };

    return (
        <div className={styles.dashboardWrapper}>
            <form className={styles.userLocationForm}>
                <input 
                    type="text" 
                    placeholder="Enter desired zipcode" 
                    value={loc} 
                    onChange={(e)=>setLoc(e.target.value)}
                />
                <button 
                    className={styles.submitButton} 
                    onClick={(e) => fetchLocationData(e, loc)}
                >
                    Test the Waters
                </button>
            </form>

            <div className={styles.chartsContainer}>
                <Chart 
                    className={styles.windSpeedChart}
                    chartType="LineChart" 
                    data={windSpeedData} 
                    options={windSpeedOptions}
                    width="400px"
                    height="400px"
                    legendToggle
                />
                 <Chart 
                    className={styles.windDirectionChart}
                    chartType="LineChart" 
                    data={windDirectionData} 
                    options={windDirectionOptions}
                    width="400px"
                    height="400px"
                    legendToggle
                />
                <Chart 
                    className={styles.visChart}
                    chartType="ScatterChart" 
                    data={visData} 
                    options={visOptions}
                    width="400px"
                    height="400px"
                    legendToggle
                />
                <Chart 
                    className={styles.rainChart}
                    chartType="AreaChart" 
                    data={rainData} 
                    options={rainOptions}
                    width="400px"
                    height="400px"
                    legendToggle
                />
            </div>
        </div>
    )
}
