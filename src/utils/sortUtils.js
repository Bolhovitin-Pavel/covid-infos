

export function GetSortDirection(sortDirection) {
    if (typeof sortDirection === "string")
        sortDirection = sortDirection.toUpperCase();

    if (sortDirection === 1 || sortDirection === "1" || sortDirection === "ASC" || sortDirection === "ASCENDING")
        return 1;
    else if (sortDirection === -1 || sortDirection === "-1" || sortDirection === "DESC" || sortDirection === "DESCENDING")
        return -1;
    else
        return 1;
}


export function CompareStrings(a, b) {
    return a.localeCompare(b);
}


export function CompareNumbers(a, b) {
    const parsedA = parseFloat(a);
    const parsedB = parseFloat(b);

    const isANaN = isNaN(parsedA);
    const isBNaN = isNaN(parsedB);

    if (isANaN && isBNaN)
        return 0;
    else if (isANaN)
        return -1;
    else if (isBNaN)
        return 1;
    else
        return a < b ? -1 : (b < a ? 1 : 0);
}


export function CompareDates(a, b) {
    if (a < b)
        return -1;
    else if (a > b)
        return 1;
    else
        return 0;
}


/**
 * @param {*} comparer Function to compare some values.
 * @param {*} sortDirection Direction to sort: -1 or 1
 * @param {*} optional Optional parametr - object with possible properties: {field: #, valueParser: #}; [field] - object field to sort by; [valueParser] - function to parse value;
 * @returns Target object comparison function.
 */
export function SortBy(comparer, sortDirection, optional) {
    const GetKey = optional !== undefined && optional.hasOwnProperty("field")
    ? (value) => value[optional.field]
    : (value) => value;

    const GetParsedKey = optional !== undefined && optional.hasOwnProperty("valueParser")
        ? (value) => optional.valueParser(GetKey(value))
        : (value) => GetKey(value);

    return function(a, b) {
        return comparer(GetParsedKey(a), GetParsedKey(b)) * sortDirection;
    }
}
