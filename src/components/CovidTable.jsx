import React, {useEffect, useState, useMemo} from "react";

import ReactDataGrid from "react-data-grid";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'

import CustomPagination from "./CustomPagination";

import { SortBy, GetSortDirection, CompareNumbers, CompareStrings } from "../utils/sortUtils";
import { GetPageCount, IsItemInPage } from "../utils/paginationUtils";
// import { ValidateNumber } from "../utils/validationUtils";
import { GetCovidInfoDate } from "../utils/covidInfoUtils";
import { IsDateInRange } from "../utils/dateUtils";

import 'bootstrap-icons/font/bootstrap-icons.css';
import CountryCovidInfo from "../classes/CountryCovidInfo";


const columns = [
    {
        key: "country",
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

const EMPTY_ROW_TITLE = "Ничего не найдено";

const defaultFilterField = {key: "default", name: "Фильтровать по полю...", type: "number",};
const initialSortType = [{ columnKey: 'country', direction: 'ASC' }];

const FIELD_FILTER_INPUT_FROM_PLACE_HOLDER = "значение от";
const FIELD_FILTER_INPUT_TO_PLACE_HOLDER = "значение до";
const SEARCH_FILTER_PLACE_HOLDER = "Поиск страны...";
const FILTER_RESET_TITLE = "Сбросить фильтры";


function GetCountryCovidInfos(infos, startDate, endDate) {
    let groups = [];


    infos.forEach(info => {
        let infoDate = GetCovidInfoDate(info);
        let isInfoDateInDateRange = IsDateInRange(infoDate, startDate, endDate, true);
        let foundGroup = groups.find(group => group.country === info.countriesAndTerritories);

        if (foundGroup !== undefined) {
            if (isInfoDateInDateRange) {
                foundGroup.cases += info.cases;
                foundGroup.deaths += info.deaths;
            }
            foundGroup.allCases += info.cases;
            foundGroup.allDeaths += info.deaths;
        }
        else {
            groups.push(new CountryCovidInfo({
                country: info.countriesAndTerritories,
                cases: isInfoDateInDateRange ? info.cases : 0,
                deaths: isInfoDateInDateRange ? info.deaths : 0,
                allCases: info.cases,
                allDeaths: info.deaths,
                popData2019: info.popData2019,
            }));
        }

    });

    return groups;
}


// Remove out of date range groups (groups without statistics (groups with zero cases and zero deaths))
function RemoveOutOfDateRangeGroups(groups) {
    
    for (var i = groups.length - 1; i >= 0; i--) {
        if (groups[i].cases === 0 && groups[i].deaths === 0) {
        groups.splice(i, 1);
        }
    }
}


function CovidTable({covidInfos, startDate, endDate}) {
    
    const [countryCovidInfo, SetCountryCovidInfo] = useState([]);
    const [sortType, SetSortType] = useState(initialSortType);
    const [searchQuery, SetSearchQuery] = useState("");
    const [filterField, SetFilterField] = useState(defaultFilterField.key);
    const [filterValueFrom, SetFilterValueFrom] = useState("");
    const [filterValueTo, SetFilterValueTo] = useState("");
    const [pageIndex, SetPageIndex] = useState(0);
    const itemsCountPerPage = 20;
    

    //#region Country Covid Infos Setup
    useEffect(() => SetupCountryCovidInfos(covidInfos, startDate, endDate), [covidInfos, startDate, endDate]);
    
    function SetupCountryCovidInfos(infos, startDate, endDate) {
        console.log("Group Covid Infos By Country Name");
        
        if (infos.length === 0)
            return;

        let groups = GetCountryCovidInfos(infos, startDate, endDate);
        RemoveOutOfDateRangeGroups(groups);
        SetCountryCovidInfo(groups);
    }
    //#endregion


    //#region Sort Setup
    const sortedGroupedCovidInfos = useMemo(() => {
        if (sortType.length > 0) {
            console.log("Sort Covid Groups");

            const compareFunction = (GetColumnType(sortType[0].columnKey) === "number") ? CompareNumbers : CompareStrings;
            const sortDirection = sortType[0].direction;
            const sortField = {field:sortType[0].columnKey};
            return [...countryCovidInfo].sort(SortBy(compareFunction, GetSortDirection(sortDirection), sortField));
        }
        else
            return countryCovidInfo;
    }, [countryCovidInfo, sortType]);


    function OnSort(sortType) {
      SetSortType(sortType);
    }
    //#endregion


    //#region Search Setup
    const searchedSortedGroupedCovidInfos = useMemo(() => {
        if (searchQuery !== "") {
            console.log("Setup Groups In Search Query");

            return sortedGroupedCovidInfos.filter(
                group => group.country.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
            );
        }
        else
            return sortedGroupedCovidInfos;
    }, [sortedGroupedCovidInfos, searchQuery]);
    //#endregion


    //#region Filter Setup
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
    //#endregion


    //#region Pages Setup
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
    //#endregion


    //#region Renderers
    function RenderEmptyRow() {
        return (
            <div style={{ textAlign: "center", padding: "12px" }}>
                {EMPTY_ROW_TITLE}
            </div>
        );
    }


    function RenderSearch() {
        return (
            <div className="col-md-auto mb-3">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder={SEARCH_FILTER_PLACE_HOLDER} value={searchQuery} onChange={event => SetSearchQuery(event.target.value)}/>
                    <span className="input-group-text" id="basic-addon1">
                        <i className="bi bi-search"/>
                    </span>
                </div>
            </div>
        );
    }


    function RenderFilterField() {
        return (
            <div className="col-md mb-1">
                <Form.Select className="me-3" value={filterField} onChange={event => SetFilterField(event.target.value)}>
                    {[defaultFilterField, ...columns].map((field, index) => {
                        if (field.type === "number")
                            return <option key={index} value={field.key}>{field.name}</option>
                        else
                            return null;
                    })}
                </Form.Select>
            </div>
        );
    }


    function RenderFilterRangeInput() {
        return (
            <>
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
            </>
        );
    }


    function RenderFilterGroup() {
        return (
            <>
                <div className="row">
                    {RenderSearch()}

                    <div className="col-md mb-2">
                        <div className="row">
                            {RenderFilterField()}

                            {RenderFilterRangeInput()}
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-row-reverse mb-3">
                    <div className="col-md-auto">
                        <Button variant="warning" onClick={ResetFilters}>{FILTER_RESET_TITLE}</Button>
                    </div>
                </div>
            </>
        );
    }


    function RenderGrid() {
        return (
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
        );
    }


    function RenderPagination() {
        return (
            <div className="d-flex flex-row-reverse">
                <CustomPagination
                    initialPage={pageIndex}
                    forcePage={pageIndex}
                    pageCount={pageCount}
                    onPageChange={pageIndex => SetPageIndex(pageIndex.selected)}
                />
            </div>
        );
    }
    //#endregion


    console.log("Render CovidTable");
    return (
        <>
            {RenderFilterGroup()}
            {RenderGrid()}
            {RenderPagination()}
        </>
    );
}


export default CovidTable;
