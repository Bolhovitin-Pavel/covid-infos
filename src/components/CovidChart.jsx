import React from "react";
import { Line } from 'react-chartjs-2';

const dataPreset = {
    labels: [],
    datasets: [
        {
            label: "Заболевания",
            data: [],
            borderColor: "#f1c40f",
            backgroundColor: "#f39c12",
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
        },
        {
            label: "Смерти",
            data: [],
            borderColor: "#e74c3c",
            backgroundColor: "#c0392b",
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
        },
    ],
};





const options = {
    responsive: true,

    plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false,
          text: "Chart Name",
        },
    },

    interaction: {
        mode: 'index',
        intersect: false,
    },

    scales: {
        x: {
            display: true,
            title: {
                display: true,
                text: "Период",
            }
        },
        y: {
            display: true,
            title: {
                display: true,
                text: "Случаи",
            }
        },
    }
};


function CovidChart({dates, cases, deaths}) {

    function GetData() {
        const data = dataPreset;
        data.labels = dates || [];
        data.datasets[0].data = cases || [];
        data.datasets[1].data = deaths || [];
        console.log(JSON.stringify(data, null, 2));
        return data;
    }


    console.log("Render Covid Chart");
    return (
        <Line data={GetData()} options={options} type="line" />
    );
}


export default CovidChart;
