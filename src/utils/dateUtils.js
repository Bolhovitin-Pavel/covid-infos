

export function IsDateInRange(date, from, to, inclusive) {
    if (inclusive)
        return (from <= date && date <= to) ? true : false;
    else
        return (from < date && date < to) ? true : false;
}
