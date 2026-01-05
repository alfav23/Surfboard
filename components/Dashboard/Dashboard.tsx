"use client"
import { useEffect, useState } from "react";
import {Chart} from "react-google-charts";
import styles from "./Dashboard.module.scss";
import { fetchWeatherApi } from 'openmeteo';

export default function Dashboard() {

    // const [weatherData, setWeatherData] = useState<any>([]);
    const [loc, setLoc] = useState<string>('');
    const [windSpeedData, setWindSpeedData] = useState<(Date | string | number)[][] | null>(null);
    const [windDirectionData, setWindDirectionData] = useState<(Date | string | number)[][] | null>(null);
    const [visData, setVisData] = useState<(Date | string | number)[][] | null>(null);
    const [rainData, setRainData] = useState<(Date | string | number)[][] | null>(null);

    const fetchLocationData = async(e: any, loc: any) => {
        e.preventDefault();
        if (loc == ""){
            setWindSpeedData(null);
            setWindDirectionData(null);
            setVisData(null);
            setRainData(null);
        } else {
            try {
                const url = `https://geocoding-api.open-meteo.com/v1/search?name=${loc}&count=10&language=en&format=json&countryCode=US`;
                const response = await fetch(url);

                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    const { latitude, longitude } = data.results[0];
                    fetchWeatherData(latitude, longitude);
                } else {
                    console.log(new Error('City not found'));
                }
            } catch (error) {
                console.error('Could not retrieve location:', error);
                return null;
            }
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

                hourly: (() => {
                    // Build a time array that starts at local midnight and ends at 23:00
                    // Use the current moment adjusted into the forecast timezone
                    // so we generate midnight..23:00 for *today* in that timezone.
                    const nowUtcSeconds = Math.floor(Date.now() / 1000);
                    const targetLocal = new Date((nowUtcSeconds + utcOffsetSeconds) * 1000);
                    const y = targetLocal.getFullYear();
                    const m = targetLocal.getMonth();
                    const d = targetLocal.getDate();

                    const times = Array.from({ length: 24 }, (_, h) => new Date(y, m, d, h, 0, 0));

                    // Align other hourly arrays to the 24-hour window (slice or pad if necessary)
                    const sliceTo = 24;
                    const tempArr = hourly.variables(0)!.valuesArray()!.slice(0, sliceTo);
                    const visArr = hourly.variables(1)!.valuesArray()!.slice(0, sliceTo);
                    const rainArr = hourly.variables(2)!.valuesArray()!.slice(0, sliceTo);
                    const snowArr = hourly.variables(3)!.valuesArray()!.slice(0, sliceTo);
                    const wsArr = hourly.variables(4)!.valuesArray()!.slice(0, sliceTo);
                    const wdArr = hourly.variables(5)!.valuesArray()!.slice(0, sliceTo);

                    return {
                        time: times,
                        temperature: tempArr,
                        visibility: visArr,
                        rain: rainArr,
                        snowfall: snowArr,
                        windSpeed: wsArr,
                        windDirection: wdArr,
                    };
                })(),
                    
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

            let tempWindSpeedData: (Date | string | number)[][] = [
                ["Time", "Speed"],
            ];

            let tempWindDirectionData: (Date | string | number)[][] = [
                ["Time", "Direction"],
            ];

            let tempVisData: (Date | string | number)[][] = [
                ["Time", "Distance"],
            ];

            let tempRainData: (Date | string | number)[][] = [
                ["Time", "Rain", "Snow"],
            ];

            for (let i = 0; i < weatherData.hourly.time.length; i++) {
                const t = weatherData.hourly.time[i];
                tempVisData.push([t, visibility[i]]);
                tempWindSpeedData.push([t, windSpeed[i]]);
                tempWindDirectionData.push([t, windDirection[i]]);
                tempRainData.push([t, rain[i], snowfall[i]]);

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

        const [colorScheme, setColorScheme] = useState('dark');
        const [chartColor, setChartColor] = useState('black');
        const [chartTextColor, setChartTextColor] = useState('white');

        useEffect (() => {
            const checkColorScheme = () => {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    setColorScheme('dark');
                    setChartColor('black');
                    setChartTextColor('grey');
                } else {
                    setColorScheme('light');
                    setChartColor('white');
                    setChartTextColor('black')
                }
            } 
            checkColorScheme()
        }, [colorScheme]);

    // wind speed
        const windSpeedOptions = {
            title: 'Wind Speed',
             titleTextStyle: {
                fontSize: 18,
                color: `${chartTextColor}`
                
    },
            curveType: 'function',
            vAxis: {
                title: "Speed (mph)",
                minValue: 0,
                gridlines: {
                    color: 'transparent',
                },
            },
            hAxis: {
                title: "Time of Day",
                format: 'HH:mm',
                gridlines: {
                    color: 'transparent'
                },
            },
            legend: {
                position: 'bottom'
            }, 
            backgroundColor: `${chartColor}`
        };

        //wind direction
        const windDirectionOptions = {
            title: 'Wind Direction',
            titleTextStyle: {
                fontSize: 18,
                color: `${chartTextColor}`,
            },
            vAxis: {
                title: "Degrees (out of 360)",
                minValue: 0,
                gridlines: {
                    color: 'transparent'
                },
            },
            hAxis: {
                title: "Time of Day",
                format: 'HH:mm',
                gridlines: {
                    color: 'transparent'
                },
            },
            legend: {
                position: 'bottom'
            }, 
            backgroundColor: `${chartColor}`
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
            titleTextStyle: {
                fontSize: 18,
                color: `${chartTextColor}`,
            },
            vAxis: {
                title: "Distance (Meters)",
                minValue: 0,
                gridlines: {
                    color: 'transparent'
                },
            },
            hAxis: {
                title: "Time of Day",
                format: 'HH:mm',
                gridlines: {
                    color: 'transparent'
                },
            },
            legend: {
                position: 'bottom'
            }, 
            backgroundColor: `${chartColor}`
        };

    // rain
        const rainOptions = {
            title: 'Precipitation',
            titleTextStyle: {
                fontSize: 18,
                color: `${chartTextColor}`,
            },
            vAxis: {
                title: "Inches",
                minValue: 0,
                gridlines: {
                    color: 'transparent'
                },
            },
            hAxis: {
                title: "Time of Day",
                format: 'HH:mm',
                gridlines: {
                    color: 'transparent'
                },
            },
            legend: {
                position: 'bottom'
            }, 
            backgroundColor: `${chartColor}`
        };

    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.dashboardHero}>
                <h2>Catch waves, not disappointment.</h2>
                <p>Take the guesswork out of your fun, and check before you surf.</p>
            </div>
            <form className={styles.userLocationForm}>
                <input 
                    type="text" 
                    placeholder="Enter desired zipcode or city" 
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

            {windSpeedData && windDirectionData && visData && rainData ? (
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
            ): (
                <div> 
                    Please enter a location to begin.
                </div>
            )}
        </div>
    )
}
