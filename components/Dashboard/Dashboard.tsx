"use client"
import { useEffect, useState } from "react";
import {Chart} from "react-google-charts";
import styles from "./Dashboard.module.scss";
import { fetchWeatherApi } from 'openmeteo';

export default function Dashboard() {

    // const [weatherData, setWeatherData] = useState<any>([]);
    const [loc, setLoc] = useState<any>([]); 

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
            for (let i = 0; i < weatherData.hourly.time.length; i++) {
                console.log(
                    weatherData.hourly.time[i].toISOString(), 
                    `${weatherData.hourly.windSpeed[i]}mph`, 
                    `${weatherData.hourly.windDirection[i]}°`,
                    `${weatherData.hourly.visibility[i]}meters`,
                    `${weatherData.hourly.snowfall[i]} inches`,
                    `${weatherData.hourly.rain[i]} inches`,
                );
            }
        };

    // wind
        const windOptions = {
            title: 'Wind',
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

        const windData = [
            ["Speed", "Hour"],
            [20, 0],
            [19, 1],
            [20, 2],
            [9, 3],
            [17, 4],
            [5, 5],
            [3, 6],
            [14, 7]

            // ["Speed", "Direction", "Hour"],
            
        ];

    // visibility
        const visOptions = {
            title: 'Visibility',
            vAxis: {
                title: "Distance (Miles)",
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

        const visData = [
            ["Distance", "Time of Day"],
            [30, 0],
            [31, 1],
            [32, 2],
            [40, 3],
            [50, 4],
            [49, 5],
            [42, 6],
            [50, 7]
        ];

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

        const rainData = [
            ["Time of Day", "Rain", "Snow"],
            [0, 1, 0],
            [1, 1, 0],
            [3, 2, 0],
            [5, 1, 0],
            [7, 0, 1],
            [10, 0, 3],
            [13, 0, 4],
            [17, 0, 5],
            [20, 0, 5],
            [23, 0, 5]
        ];

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
                    className={styles.windChart}
                    chartType="LineChart" 
                    data={windData} 
                    options={windOptions}
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
