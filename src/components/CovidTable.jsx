import React, {useEffect, useState, useMemo} from "react";
import ReactDataGrid from "react-data-grid";
import {GetGroupedCovidInfo, RemoveOutOfDateRangeGroups, ValidateGroups} from "../utils/groupedCovidInfoUtils"
import {SortBy, CompareNumbers, CompareStrings} from "../utils/sortUtils";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'
import 'bootstrap-icons/font/bootstrap-icons.css';
import CustomPagination from "./CustomPagination";
import { GetPageCount, IsItemInPage } from "../utils/paginationUtils";


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
            return [...groupedCovidInfos].sort(SortBy(compareFunction, sortDirection, sortField));
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
