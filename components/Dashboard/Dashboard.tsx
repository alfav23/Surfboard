"use client"
import { useEffect, useState } from "react";
import {Chart} from "react-google-charts";
import styles from "./Dashboard.module.scss";

export default function Dashboard() {
    const [weatherData, setWeatherData] = useState<any>([]);
    const [loc, setLoc] = useState<any>([]); 

    useEffect(() => {
        
        const fetchWeatherData = async() => {
           
        }
    }), [loc];

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
    )
}
