import React, {useEffect, useState, useMemo} from "react";
import ReactDataGrid from "react-data-grid";
import {GetGroupedCovidInfo, RemoveOutOfDateRangeGroups, ValidateGroups} from "../utils/groupedCovidInfoUtils"
import {SortBy, CompareNumbers} from "../utils/sortUtils";
import Search from "./Search";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form'


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



const defaultFilterField = {key: "default", name: "Фильтровать по полю...", type: "number",};
const initialSortType = [{ columnKey: 'countriesAndTerritories', direction: 'ASC' }];

const FIELD_FILTER_INPUT_FROM_PLACE_HOLDER = "значение от";
const FIELD_FILTER_INPUT_TO_PLACE_HOLDER = "значение до";
const SEARCH_FILTER_PLACE_HOLDER = "Поиск страны...";


function CovidTable({covidInfos, startDate, endDate}) {
    useEffect(() => SetupGroupedCovidInfo(covidInfos, startDate, endDate), [covidInfos, startDate, endDate]);

    const [groupedCovidInfos, SetGroupedCovidInfos] = useState([]);
    const [sortType, setSortType] = useState(initialSortType);
    const [searchQuery, SetSearchQuery] = useState("");

    const [filterField, SetFilterField] = useState(defaultFilterField.key);
    const [filterValueFrom, SetFilterValueFrom] = useState("");
    const [filterValueTo, SetFilterValueTo] = useState("");

    function SetupGroupedCovidInfo(covidInfos, startDate, endDate) {
        console.log("Group Covid Infos By Country Name");

        let groups = GetGroupedCovidInfo(covidInfos, startDate, endDate);
        RemoveOutOfDateRangeGroups(groups);
        ValidateGroups(groups);
        SetGroupedCovidInfos(groups);
    }


    const sortedGroupedCovidInfos = useMemo(() => {
        console.log("Sort Covid Groups");

        if (sortType.length > 0)
            return [...groupedCovidInfos].sort(SortBy(CompareNumbers, sortType[0].direction, {field:sortType[0].columnKey}));
        else
            return groupedCovidInfos;
    }, [groupedCovidInfos, sortType]);


    function OnSort(sortType) {
      setSortType(sortType);
    }


    const searchedSortedGroupedCovidInfos = useMemo(() => {
        console.log("Setup Groups In Search Query");

        if (searchQuery !== "")
            return sortedGroupedCovidInfos.filter(
                group => group.countriesAndTerritories.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
            );
        else
            return sortedGroupedCovidInfos;
    }, [sortedGroupedCovidInfos, searchQuery]);


    const filteredSearchedSortedGroupedCovidInfos = useMemo(() => {
        console.log("Filter Groups");

        const parsedFrom = parseFloat(filterValueFrom);
        const parsedTo = parseFloat(filterValueTo);
        const from = isNaN(parsedFrom) ? -Infinity : parsedFrom;
        const to = isNaN(parsedTo) ? Infinity : parsedTo;
        
        if (filterField !== defaultFilterField.key)
            return searchedSortedGroupedCovidInfos.filter(
                group => (from <= group[filterField] && group[filterField] <= to)
            );
        else
            return searchedSortedGroupedCovidInfos;
    }, [searchedSortedGroupedCovidInfos, filterField, filterValueFrom, filterValueTo]);



    // useEffect(() => GetGroupsInSearchQuery(), [groupedCovidInfos]);

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
                <div className="col-md-auto">
                    <Search placeHolder={SEARCH_FILTER_PLACE_HOLDER} value={searchQuery} onChange={(event) => SetSearchQuery(event.target.value)}/>
                </div>

                <div className="col-md mb-3">
                    <div className="input-group">
                        <Form.Select className="me-3" value={filterField} onChange={event => SetFilterField(event.target.value)}>
                            {[defaultFilterField, ...columns].map((field, index) => {
                                if (field.type === "number")
                                    return <option key={index} value={field.key}>{field.name}</option>
                                else
                                    return;
                            })}
                        </Form.Select>

                        <input
                            type="number"
                            className="form-control me-3"
                            placeholder={FIELD_FILTER_INPUT_FROM_PLACE_HOLDER}
                            value={filterValueFrom}
                            onChange={event => SetFilterValueFrom(event.target.value)}
                        />
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

            <div className="d-flex flex-row-reverse mb-3">
                <div className="col-md-auto">
                    <Button variant="warning" onClick={() => console.log("Reset filters")}>Сбросить фильтры</Button>
                </div>
            </div>

            <ReactDataGrid
                columns={columns}
                rows={filteredSearchedSortedGroupedCovidInfos}
                defaultColumnOptions={{
                resizable: true,
                sortable: true,
                }}
                sortColumns={sortType}
                onSortColumnsChange={OnSort}
                noRowsFallback={<RenderEmptyRow/>}
                className="rdg-light"
            />
        </>
    );
}


export default CovidTable;
