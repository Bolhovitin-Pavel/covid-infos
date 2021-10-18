import React, {useEffect, useState, useMemo} from "react";

import ReactDataGrid from "react-data-grid";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'

import CustomPagination from "./CustomPagination";

import { SortBy, GetSortDirection, CompareNumbers, CompareStrings } from "../utils/sortUtils";
import { GetPageCount, IsItemInPage } from "../utils/paginationUtils";
import { ValidateNumber } from "../utils/validationUtils";
import { GetCovidInfoDate } from "../utils/covidInfoUtils";
import { IsDateInRange } from "../utils/dateUtils";

import 'bootstrap-icons/font/bootstrap-icons.css';


const columns = [
    {
        key: "countriesAndTerritories",
        name: "Страна",
        type: "string",
    },
    {
        key: "cases",
        name: "Количество случаев",
        type: "number",
    },
    {
        key: "deaths",
        name: "Количество смертей",
        type: "number",
    },
    {
        key: "allCases",
        name: "Количество случаев всего",
        type: "number",
    },
    {
        key: "allDeaths",
        name: "Количество смертей всего",
        type: "number",
    },
    {
        key: "casesPer1000",
        name: "Количество случаев на 1000 житилей",
        type: "number",
    },
    {
        key: "deathsPer1000",
        name: "Количество смертей на 1000 житилей",
        type: "number",
    },
];

function GetColumnType(key) {
    const columnByKey = columns.find(column => column.key === key);
    return columnByKey.type;
}


const defaultFilterField = {key: "default", name: "Фильтровать по полю...", type: "number",};
const initialSortType = [{ columnKey: 'countriesAndTerritories', direction: 'ASC' }];

const FIELD_FILTER_INPUT_FROM_PLACE_HOLDER = "значение от";
const FIELD_FILTER_INPUT_TO_PLACE_HOLDER = "значение до";
const SEARCH_FILTER_PLACE_HOLDER = "Поиск страны...";


// Group Covid Infos By Country Name
function GetGroupedCovidInfo(covidInfos, startDate, endDate) {
    let groups = [];

    // Group covid infos by country name
    covidInfos.forEach(info => {
        var infoDate = GetCovidInfoDate(info);
        var isInfoDateInUserRangeRequest = IsDateInRange(infoDate, startDate, endDate, true);
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

const VALIDATION_NAN_VALUE = "Нет данных";
const VALIDATION_INF_VALUE = 0;
const VALIDATION_SPECIAL_CASES = {nanValue: VALIDATION_NAN_VALUE, infValue: VALIDATION_INF_VALUE};

function ValidateGroup(group) {
    group.cases = ValidateNumber(group.cases, VALIDATION_SPECIAL_CASES);
    group.deaths = ValidateNumber(group.deaths, VALIDATION_SPECIAL_CASES);
    group.allCases = ValidateNumber(group.allCases, VALIDATION_SPECIAL_CASES);
    group.allDeaths = ValidateNumber(group.allDeaths, VALIDATION_SPECIAL_CASES);
    group.casesPer1000 = ValidateNumber(group.casesPer1000, VALIDATION_SPECIAL_CASES);
    group.deathsPer1000 = ValidateNumber(group.deathsPer1000, VALIDATION_SPECIAL_CASES);
}


function CovidTable({covidInfos, startDate, endDate}) {
    useEffect(() => SetupGroupedCovidInfo(covidInfos, startDate, endDate), [covidInfos, startDate, endDate]);

    const [groupedCovidInfos, SetGroupedCovidInfos] = useState([]);
    const [sortType, SetSortType] = useState(initialSortType);
    const [searchQuery, SetSearchQuery] = useState("");
    const [filterField, SetFilterField] = useState(defaultFilterField.key);
    const [filterValueFrom, SetFilterValueFrom] = useState("");
    const [filterValueTo, SetFilterValueTo] = useState("");
    const [pageIndex, SetPageIndex] = useState(0);
    const itemsCountPerPage = 20;


    function SetupGroupedCovidInfo(covidInfos, startDate, endDate) {
        console.log("Group Covid Infos By Country Name");

        let groups = GetGroupedCovidInfo(covidInfos, startDate, endDate);
        RemoveOutOfDateRangeGroups(groups);
        ValidateGroups(groups);
        SetGroupedCovidInfos(groups);
    }




    const sortedGroupedCovidInfos = useMemo(() => {
        if (sortType.length > 0) {
            console.log("Sort Covid Groups");

            const compareFunction = (GetColumnType(sortType[0].columnKey) === "number") ? CompareNumbers : CompareStrings;
            const sortDirection = sortType[0].direction;
            const sortField = {field:sortType[0].columnKey};
            return [...groupedCovidInfos].sort(SortBy(compareFunction, GetSortDirection(sortDirection), sortField));
        }
        else
            return groupedCovidInfos;
    }, [groupedCovidInfos, sortType]);


    function OnSort(sortType) {
      SetSortType(sortType);
    }


    const searchedSortedGroupedCovidInfos = useMemo(() => {
        if (searchQuery !== "") {
            console.log("Setup Groups In Search Query");

            return sortedGroupedCovidInfos.filter(
                group => group.countriesAndTerritories.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
            );
        }
        else
            return sortedGroupedCovidInfos;
    }, [sortedGroupedCovidInfos, searchQuery]);


    const filteredSearchedSortedGroupedCovidInfos = useMemo(() => {
        if (filterField !== defaultFilterField.key) {
            console.log("Filter Groups");

            const parsedFrom = parseFloat(filterValueFrom);
            const parsedTo = parseFloat(filterValueTo);
            const from = isNaN(parsedFrom) ? -Infinity : parsedFrom;
            const to = isNaN(parsedTo) ? Infinity : parsedTo;

            return searchedSortedGroupedCovidInfos.filter(
                group => (from <= group[filterField] && group[filterField] <= to)
            );
        }
        else
            return searchedSortedGroupedCovidInfos;
    }, [searchedSortedGroupedCovidInfos, filterField, filterValueFrom, filterValueTo]);


    function ResetFilters() {
        SetSortType(initialSortType);
        SetSearchQuery("");
        SetFilterField(defaultFilterField.key);
        SetFilterValueFrom("");
        SetFilterValueTo("");
    }


    const pageCount = useMemo(() => {
        return GetPageCount(filteredSearchedSortedGroupedCovidInfos.length, itemsCountPerPage);

    }, [filteredSearchedSortedGroupedCovidInfos]);
    

    useEffect(() => {
        if (pageCount > 0 && pageIndex >= pageCount) {
            console.log("Limit page index");

            SetPageIndex(pageCount - 1);
        }
    }, [pageCount])


    const pagedFilteredSearchedSortedGroupedCovidInfos = useMemo(() => {

        return filteredSearchedSortedGroupedCovidInfos.filter((_, index) => 
            IsItemInPage(index, pageIndex, itemsCountPerPage)
        )
    }, [filteredSearchedSortedGroupedCovidInfos, pageIndex]);




    function RenderEmptyRow() {
        return (
            <div style={{ textAlign: "center", padding: "12px" }}>
                Ничего не найдено
            </div>
        );
    }

    console.log("Render CovidTable");
    return (
        <>
            <div className="row">
                <div className="col-md-auto mb-3">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder={SEARCH_FILTER_PLACE_HOLDER} value={searchQuery} onChange={event => SetSearchQuery(event.target.value)}/>
                        <span className="input-group-text" id="basic-addon1">
                            <i className="bi bi-search"/>
                        </span>
                    </div>
                </div>

                <div className="col-md mb-2">
                    <div className="row">
                        <div className="col-md mb-1">
                            <Form.Select className="me-3" value={filterField} onChange={event => SetFilterField(event.target.value)}>
                                {[defaultFilterField, ...columns].map((field, index) => {
                                    if (field.type === "number")
                                        return <option key={index} value={field.key}>{field.name}</option>
                                    else
                                        return;
                                })}
                            </Form.Select>
                        </div>

                        <div className="col-md mb-1">
                            <input
                                type="number"
                                className="form-control"
                                placeholder={FIELD_FILTER_INPUT_FROM_PLACE_HOLDER}
                                value={filterValueFrom}
                                onChange={event => SetFilterValueFrom(event.target.value)}
                            />
                        </div>

                        <div className="col-md">
                            <input
                                type="number"
                                className="form-control"
                                placeholder={FIELD_FILTER_INPUT_TO_PLACE_HOLDER}
                                value={filterValueTo}
                                onChange={event => SetFilterValueTo(event.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex flex-row-reverse mb-3">
                <div className="col-md-auto">
                    <Button variant="warning" onClick={ResetFilters}>Сбросить фильтры</Button>
                </div>
            </div>

            
            
            <div className="mb-3">
                <ReactDataGrid
                    columns={columns}
                    rows={pagedFilteredSearchedSortedGroupedCovidInfos}
                    defaultColumnOptions={{
                    resizable: true,
                    sortable: true,
                    }}
                    sortColumns={sortType}
                    onSortColumnsChange={OnSort}
                    noRowsFallback={<RenderEmptyRow/>}
                    className="rdg-light"
                />
            </div>


            <div className="d-flex flex-row-reverse">
                <CustomPagination
                    initialPage={pageIndex}
                    forcePage={pageIndex}
                    pageCount={pageCount}
                    onPageChange={pageIndex => SetPageIndex(pageIndex.selected)}
                />
            </div>
            
        </>
    );
}


export default CovidTable;
