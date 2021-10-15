

export function GetCovidInfoDate(covidInfo) {
    return new Date(Date.UTC(covidInfo.year, covidInfo.month - 1, covidInfo.day));
}