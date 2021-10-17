import React, { useMemo, useState } from "react";
import { Line } from 'react-chartjs-2';
import { IsDateInRange } from "../utils/dateUtils";
import { GetGroupedCovidInfoByDate } from "../utils/groupedCovidInfoUtils";
import { GetCountyList } from "../utils/covidInfoUtils";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { CompareStrings, SortBy } from "../utils/sortUtils";


function GetChartData(labels, dataset1, dataset2) {
    return (
        {
            labels: labels,
            datasets: [
                {
                    label: "Заболевания",
                    data: dataset1,
                    borderColor: "#f1c40f",
                    backgroundColor: "#f39c12",
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    borderWidth: 1,
                    pointRadius: 1,
                    pointHoverRadius: 4,
                },
                {
                    label: "Смерти",
                    data: dataset2,
                    borderColor: "#e74c3c",
                    backgroundColor: "#c0392b",
                    cubicInterpolationMode: 'monotone',
                    tension: 0.4,
                    borderWidth: 1,
                    pointRadius: 1,
                    pointHoverRadius: 4,
                },
            ],
        }
    );
}


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

const DEFAULT_COUNTRY_FILTER = {value: "", name: "Все страны..."};


function CovidChart({covidInfos, startDate, endDate}) {

    const [countryFilter, SetCountryFilter] = useState(DEFAULT_COUNTRY_FILTER.value);

    const countryList = useMemo(() => GetCountyList(covidInfos).sort(SortBy(CompareStrings, "ASC")), [covidInfos]);

    const groupedCovidInfoByDate = useMemo(() => {
        if (covidInfos === undefined)
            return undefined;
        else {
            console.log("groupedCovidInfoByDate");

            return GetGroupedCovidInfoByDate(covidInfos);
        }
    }, [covidInfos]);


    const infoInDateRange = useMemo(() => {
        if (groupedCovidInfoByDate === undefined)
            return undefined;
        else {
            console.log("infoInDateRange");

            return groupedCovidInfoByDate.filter(group => 
                IsDateInRange(group.date, startDate, endDate, true)
            );
        }
    }, [groupedCovidInfoByDate, startDate, endDate])





    const chartData = useMemo(() => {

        if (infoInDateRange === undefined)
            return GetChartData([], [], []);
        else {
            console.log("chartData");
            
            return GetChartData(
                infoInDateRange.map(group => group.date.toISOString().split('T')[0]),
                infoInDateRange.map(group => group.cases),
                infoInDateRange.map(group => group.deaths)
            );
        }
    }, [infoInDateRange]);


    console.log("Render Covid Chart");
    return (
        <>
            <Form className="m-3">
                <Form.Group as={Row} className="">
                    <Form.Label column sm="auto">
                        Страна
                    </Form.Label>
                    <Col sm="auto">
                        <Form.Select value={countryFilter} onChange={event => SetCountryFilter(event.target.value)}>
                            <option key={-1} value={DEFAULT_COUNTRY_FILTER.value}>{DEFAULT_COUNTRY_FILTER.name}</option>
                            {countryList.map((country, index) => <option key={index} value={country}>{country}</option>)}
                        </Form.Select>
                    </Col>
                </Form.Group>
            </Form>

            





            <Line
                type="line"
                data={chartData}
                options={options}
            />

        </>
    );
}


export default CovidChart;
