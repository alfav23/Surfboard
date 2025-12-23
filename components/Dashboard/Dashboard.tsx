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

    // wind chart data
        const windOptions = {
            title: 'Wind',
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        const windData = weatherData.arrayToDataTable([
            ["Speed", "Direction", "Hour"],
            [20, "Southeast", 0],
            [19, "South", 1],
        ])
    // end wind chart data
    // vis chart data
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
        ])
    // end vis chart data
    // rain chart data
        const rainOptions = {
            title: 'Wind',
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
        const rainData = weatherData.arrayToDataTable([
            ["Speed", "Direction", "Hour"],
            [20, "Southeast", 0],
            [19, "South", 1],
        ])
    // end rain chart data
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
