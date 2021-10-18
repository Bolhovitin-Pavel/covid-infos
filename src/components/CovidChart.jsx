import React, { useMemo, useState } from "react";
import { Line } from 'react-chartjs-2';
import { IsDateInRange } from "../utils/dateUtils";
import { GetCountyList, GetCovidInfoDate } from "../utils/covidInfoUtils";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { SortBy, CompareStrings, CompareDates, GetSortDirection } from "../utils/sortUtils";


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

export const ALL_COUNTRY_FILTER = "";
const DEFAULT_COUNTRY_FILTER = {value: ALL_COUNTRY_FILTER, name: "Все страны..."};



// Group Covid Infos By Date:
// Limitation by date (query in date range)
// Limitation by country (one county / all counties)
// Output objects: {dates: [], casesGroups: []], deathsGroups: []]}
function GetGroupedCovidInfoByDate(covidInfos, countryFilter) {
    let groups = [];


    covidInfos.forEach(info => {
        if (CheckCountryFilter(info.countriesAndTerritories, countryFilter) === false)
            return;

        const infoDate = GetCovidInfoDate(info);

        const foundGroup = groups.find(group => group.date.getTime() === infoDate.getTime());

        const parsedCases = parseFloat(info.cases);
        const parsedDeaths = parseFloat(info.deaths);

        if (foundGroup !== undefined) {
            foundGroup.cases += isNaN(parsedCases) ? 0: parsedCases;
            foundGroup.deaths += isNaN(parsedDeaths) ? 0: parsedDeaths;
        }
        else {
            groups.push({
                date: infoDate,
                cases: isNaN(parsedCases) ? 0: parsedCases,
                deaths: isNaN(parsedDeaths) ? 0: parsedDeaths,
            });
        }
    });

    groups.sort(SortBy(CompareDates, GetSortDirection("ASC"), {field: "date"}));
    return groups;
}


function CheckCountryFilter(country, countryFilter) {
    if (countryFilter === ALL_COUNTRY_FILTER)
        return true;
    else
        return country === countryFilter;
}


function CovidChart({covidInfos, startDate, endDate}) {

    const [countryFilter, SetCountryFilter] = useState(DEFAULT_COUNTRY_FILTER.value);


    const countryList = useMemo(() => GetCountyList(covidInfos).sort(SortBy(CompareStrings, GetSortDirection("ASC"))), [covidInfos]);


    const groupedCovidInfoByDate = useMemo(() => {
        if (covidInfos === undefined)
            return undefined;
        else {
            console.log("groupedCovidInfoByDate");

            return GetGroupedCovidInfoByDate(covidInfos, countryFilter);
        }
    }, [covidInfos, countryFilter]);


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
