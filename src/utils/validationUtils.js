

/**
 * @description Validating the number to check the cases: Nan, Infinity.
 * @param {*} number Target validation number.
 * @param {*} optional Optional parametr with values to replace special cases. Object with possible properties: {nanValue: #, infValue: #}.
 * @returns Returns number in common cases; NaN/Infinity or custom values in special cases;
 */
 export function ValidateNumber(number, optional) {
    let parsedNumber = Number.parseFloat(number);

    if (Number.isNaN(parsedNumber))
        return (optional !== undefined && optional.hasOwnProperty("nanValue")) ? optional.nanValue : parsedNumber;
    else if (Number.isFinite(parsedNumber) === false)
        return (optional !== undefined && optional.hasOwnProperty("infValue")) ? optional.infValue : parsedNumber;
    else
        return number;
}
