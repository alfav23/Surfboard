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
            legend: {
                position: 'bottom'
            }
        };

        const windData = weatherData.arrayToDataTable([
            ["Speed", "Hour"],
            [20, 0],
            [19, 1],
        ]);

    // visibility
        const visOptions = {
            title: 'Visibility',
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };

        const visData = weatherData.arrayToDataTable([
            ["Distance", "Hour"],
            [30, 0],
            [31, 1],
        ]);

    // rain
        const rainOptions = {
            title: 'Precipitation',
            vAxis: {
                title: "Inches",
                minValue: 0,
                maxValue: 20
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

        const rainData = weatherData.arrayToDataTable([
            ["Snow", "Rain", "Hour"],
            [0, 0],
            [0, 1],
        ]);

    return (
        <div className={styles.chartsContainer}>
            <Chart 
                className={styles.windChart}
                chartType="LineChart" 
                data={windData} 
                options={windOptions}
            />
            <Chart 
                className={styles.visChart}
                chartType="ScatterChart" 
                data={visData} 
                options={visOptions}
            />
            <Chart 
                className={styles.rainChart}
                chartType="AreaChart" 
                data={rainData} 
                options={rainOptions}
            />
        </div>
    )
}
