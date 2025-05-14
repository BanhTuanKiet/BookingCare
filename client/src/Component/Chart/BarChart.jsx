import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

function BarChart({ data, total, label, labels }) {
    const [key, setKey] = useState()
    const [barData, setBarData] = useState()

    useEffect(() => {
        if (data?.length > 0) {
            const keys = Object.keys(data[0])
            setKey(keys[1])
        }
    }, [data])

    useEffect(() => {
        if (!key || !data || !Array.isArray(data) || data.length === 0 || !labels) return

        const newBarData = {
            labels: labels,
            datasets: [
                {
                    label: label || 'Data',
                    data: data.map(item => item[key] || 0),
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.7)",
                        "rgba(255, 159, 64, 0.7)",
                        "rgba(255, 205, 86, 0.7)",
                        "rgba(75, 192, 192, 0.7)",
                        "rgba(54, 162, 235, 0.7)",
                    ],
                },
            ],
        }

        setBarData(newBarData)
    }, [key, data, label, labels])
    
    const barOptions = {
        responsive: true,
            plugins: {
            legend: {
                display: false,
                position: "top",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: total, 
                ticks: {
                stepSize: 1,
                },
            },
        },
    }

    return barData ? <Bar data={barData} options={barOptions} /> : <div>Loading chart...</div>

}

export default BarChart