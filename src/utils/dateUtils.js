

export function IsInDateRange(date, rangeStartDate, rangeEndDate, inclusive) {
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