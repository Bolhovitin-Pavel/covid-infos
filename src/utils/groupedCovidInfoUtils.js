import {IsDateInRange} from "./dateUtils";
import {GetCovidInfoDate} from "./covidInfoUtils";


// Group Covid Infos By Country Name
export function GetGroupedCovidInfo(covidInfos, startDate, endDate) {
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
export function RemoveOutOfDateRangeGroups(groups) {
    for (var i = groups.length - 1; i >= 0; i--) {
        if (groups[i].cases === 0 && groups[i].deaths === 0) {
        groups.splice(i, 1);
        }
    }
}


export function ValidateGroups(groups) {
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

// Group Covid Infos By Date:
// Limitation by date (query in date range)
// Limitation by country (one county / all counties)
// Output objects: {date: #, cases: #, deaths: #}
// export function GetGroupedCovidInfoByDate(covidInfos, startDate, endDate, country) {
//     let groups = [];

//     covidInfos.map(info => {
        
//     });
// }

// "dateRep" : "14/12/2020",
// "day" : "14",
// "month" : "12",
// "year" : "2020",

// IsDateInRange(covidInfo[date], startDate, endDate, true);
// IsStringEquals(target, compare)
// IsStringEquals(covidInfo[countriesAndTerritories], compare);


// function Test(covidInfo, field, startDate, endDate) {
//     return IsDateInRange(covidInfo[field], startDate, endDate, true);
// }



// function CheckAdmissibilityBy(limitation) {
//     const GetKey = options !== undefined && options.hasOwnProperty("field")
//         ? (value) => value[options.field]
//         : (value) => value;

//     const GetParsedKey = options !== undefined && options.hasOwnProperty("valueParser")
//         ? (value) => options.valueParser(GetKey(value))
//         : (value) => GetKey(value);

//     return function (value) {
//         return options(value);
//     }
// }



// /**
//  * 
//  * @param {*} value 
//  * @param {function} limitation 
//  */
// function CheckValueForLimitation(value, limitation) {
//     return limitation(value);
// }
