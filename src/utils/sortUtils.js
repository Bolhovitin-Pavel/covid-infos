

function GetSortDirection(sortDirection) {
    if (typeof sortDirection === "number") {
        if (sortDirection > 0)
        return 1;
        else if (sortDirection < 0)
        return -1;
    }
    else if (typeof sortDirection === "string") {
        switch (sortDirection.toLowerCase()) {
        case "asc":
            return 1;
        case "ascending":
            return 1;
        case "desc":
            return -1;
        case "descending":
            return -1;
        }
    }

    return 1;
}

export function CompareStrings(a, b) {
    return a.localeCompare(b);
}

export function CompareNumbers(a, b) {
    return a < b ? -1 : (b < a ? 1 : 0);
}

export function SortBy(comparer, sortDirection, options) {
    const GetKey = options !== undefined && options.hasOwnProperty("field")
    ? (value) => value[options.field]
    : (value) => value;

    const GetParsedKey = options !== undefined && options.hasOwnProperty("valueParser")
        ? (value) => options.valueParser(GetKey(value))
        : (value) => GetKey(value);

    return function(a, b) {
        return comparer(GetParsedKey(a), GetParsedKey(b)) * GetSortDirection(sortDirection);
    }
}
