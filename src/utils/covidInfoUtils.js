

export function GetCovidInfoDate(covidInfo) {
    return new Date(Date.UTC(covidInfo.year, covidInfo.month - 1, covidInfo.day));
}


export function GetCountyList(covidInfos) {
    let uniqueCountryList = new Set();
    covidInfos.map(info => uniqueCountryList.add(info.countriesAndTerritories));
    return Array.from(uniqueCountryList);
}