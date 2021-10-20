import { ValidateNumber } from "../utils/validationUtils";


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


const VALIDATION_NAN_VALUE = "Нет данных";
const VALIDATION_INF_VALUE = 0;
const VALIDATION_SPECIAL_CASES = {nanValue: VALIDATION_NAN_VALUE, infValue: VALIDATION_INF_VALUE};


export default class CountryCovidInfo {

    #country;
    #cases;
    #deaths;
    #allCases;
    #allDeaths;
    #popData2019;


    constructor(options) {
        this.#country = options.country;
        this.#cases = ValidateNumber(options.cases, VALIDATION_SPECIAL_CASES);
        this.#deaths = ValidateNumber(options.deaths, VALIDATION_SPECIAL_CASES);
        this.#allCases = ValidateNumber(options.allCases, VALIDATION_SPECIAL_CASES);
        this.#allDeaths = ValidateNumber(options.allDeaths, VALIDATION_SPECIAL_CASES);
        this.#popData2019 = ValidateNumber(options.popData2019, VALIDATION_SPECIAL_CASES);
    }


    set country(value) {
        this.#country = value;
    }

    get country() {
        return this.#country;
    }


    set cases(value) {
        this.#cases = ValidateNumber(value, VALIDATION_SPECIAL_CASES);
    }

    get cases() {
        return this.#cases;
    }


    set deaths(value) {
        this.#deaths = ValidateNumber(value, VALIDATION_SPECIAL_CASES);
    }

    get deaths() {
        return this.#deaths;
    }


    set allCases(value) {
        this.#allCases = ValidateNumber(value, VALIDATION_SPECIAL_CASES);
    }

    get allCases() {
        return this.#allCases;
    }


    set allDeaths(value) {
        this.#allDeaths = ValidateNumber(value, VALIDATION_SPECIAL_CASES);
    }

    get allDeaths() {
        return this.#allDeaths;
    }


    set popData2019(value) {
        this.#popData2019 = ValidateNumber(value, VALIDATION_SPECIAL_CASES);
    }

    get popData2019() {
        return this.#popData2019;
    }


    get casesPer1000() {
        return ValidateNumber(RoundNumber(GetFraction(this.#cases, this.#popData2019, 1000)), VALIDATION_SPECIAL_CASES);
    }

    get deathsPer1000() {
        return ValidateNumber(RoundNumber(GetFraction(this.#deaths, this.#popData2019, 1000)), VALIDATION_SPECIAL_CASES);
    }
}
