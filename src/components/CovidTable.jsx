import React, { useEffect, useState } from "react";
import ReactDataGrid from "react-data-grid";



const columns = [
    {
        key: "countriesAndTerritories",
        name: "Страна",
    },
    {
        key: "cases",
        name: "Количество случаев",
    },
    {
        key: "deaths",
        name: "Количество смертей",
    },
    {
        key: "allCases",
        name: "Количество случаев всего",
    },
    {
        key: "allDeaths",
        name: "Количество смертей всего",
    },
    {
        key: "casesPer1000",
        name: "Количество случаев на 1000 житилей",
    },
    {
        key: "deathsPer1000",
        name: "Количество смертей на 1000 житилей",
    },
];


function CovidTable({covidInfos, startDate, endDate}) {
    useEffect(() => console.log(covidInfos), [covidInfos, startDate, endDate]);
    useEffect(() => SetupGroupedCovidInfo(), [covidInfos, startDate, endDate]);

    const [groupedCovidInfos, SetGroupedCovidInfos] = useState(new Array());



    

    //#region Grouped Covid Infos By Country Name
    function SetupGroupedCovidInfo() {
        console.log("Group Covid Infos By Country Name");

        let groups = GetGroupedCovidInfo();
        RemoveOutOfDateRangeGroups(groups);
        ValidateGroups(groups);
        SetGroupedCovidInfos(groups);

    }


    function GetGroupedCovidInfo() {
        let groups = new Array();
        console.log(covidInfos);

        // Group covid infos by country name
        covidInfos.forEach(info => {
            var infoDate = GetCovidInfoDate(info);
            var isInfoDateInUserRangeRequest = IsInDateRange(infoDate, startDate, endDate, true);
            var foundedGroup = groups.find(group => group.countriesAndTerritories === info.countriesAndTerritories);

            // Add to exist group: cases in date range, deaths in date range, all cases, all deaths
            if (foundedGroup != null) {
            if (isInfoDateInUserRangeRequest) {
                foundedGroup.cases += info.cases;
                foundedGroup.deaths += info.deaths;
            }
            foundedGroup.allCases += info.cases;
            foundedGroup.allDeaths += info.deaths;
            }
            // Setup new group
            else {
            groups.push({
                countriesAndTerritories: info.countriesAndTerritories,
                cases: isInfoDateInUserRangeRequest ? info.cases : 0,
                deaths: isInfoDateInUserRangeRequest ? info.deaths : 0,
                allCases: info.cases,
                allDeaths: info.deaths,
                casesPer1000: 0,
                deathsPer1000: 0,
                popData2019 : info.popData2019,
            });
            }
        }, 0)

        // Setup cases per 1000, deaths per 1000
        groups.forEach((group, index) => {
            group.id = index;
            group.casesPer1000 = RoundNumber(GetFraction(group.cases, group.popData2019, 1000));
            group.deathsPer1000 = RoundNumber(GetFraction(group.deaths, group.popData2019, 1000));
        });

        return groups;
    }


    function GetCovidInfoDate(covidInfo) {
        return new Date(Date.UTC(covidInfo.year, covidInfo.month - 1, covidInfo.day));
    }


    function IsInDateRange(date, rangeStartDate, rangeEndDate, inclusive) {
        if (inclusive) {
            if (rangeStartDate <= date && date <= rangeEndDate)
            return true;
        }
        else {
            if (rangeStartDate < date && date < rangeEndDate)
            return true;
        }

        return false;
    }


    function GetFraction(value, allCount, targetCount) {
        value = Number.parseFloat(value);
        allCount = Number.parseFloat(allCount);
        targetCount = Number.parseFloat(targetCount);

        if (isNaN(value) || isNaN(allCount) || isNaN(targetCount))
            return NaN;
        else
            return value / allCount * targetCount;
    }


    function RoundNumber(number) {
        return Math.round(number * 1000) / 1000;
    }


    // Remove out of date range groups (groups without statistics (groups with zero cases and zero deaths))
    function RemoveOutOfDateRangeGroups(groups) {
        for (var i = groups.length - 1; i >= 0; i--) {
            if (groups[i].cases === 0 && groups[i].deaths === 0) {
            groups.splice(i, 1);
            }
        }
    }

    function ValidateGroups(groups) {
        groups.forEach(
            group => ValidateGroup(group)
        );
    }

    function ValidateGroup(group) {
        group.cases = ValidateNumber(group.cases);
        group.deaths = ValidateNumber(group.deaths);
        group.allCases = ValidateNumber(group.allCases);
        group.allDeaths = ValidateNumber(group.allDeaths);
        group.casesPer1000 = ValidateNumber(group.casesPer1000);
        group.deathsPer1000 = ValidateNumber(group.deathsPer1000);
    }

    function ValidateNumber(number) {
        let parsedNumber = Number.parseFloat(number);
        if (Number.isNaN(parsedNumber))
            return "Нет данных";
        else if (Number.isFinite(parsedNumber) === false)
            return 0;
        else
            return number;
    }
    //#endregion


    console.log("Render CovidTable");
    return (
        <ReactDataGrid
            columns={columns}
            rows={groupedCovidInfos}
            defaultColumnOptions={{
              resizable: true,
              sortable: true,
            }}
            className="rdg-light"
        />
    );
}


export default CovidTable;
