

export function IsDateInRange(target, from, to, inclusive) {
    if (inclusive)
        return (from <= target && target <= to) ? true : false;
    else
        return (from < target && target < to) ? true : false;
}
