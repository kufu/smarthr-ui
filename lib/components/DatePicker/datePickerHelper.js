"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJpnDateString = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
var JpnEra = /** @class */ (function () {
    function JpnEra(from) {
        this.from = from;
    }
    JpnEra.prototype.getADYear = function (year) {
        return year + this.from.getFullYear() - 1;
    };
    return JpnEra;
}());
var meiji = new JpnEra(new Date(1868, 9, 23));
var taisho = new JpnEra(new Date(1912, 6, 30));
var showa = new JpnEra(new Date(1926, 11, 25));
var heisei = new JpnEra(new Date(1989, 0, 8));
var reiwa = new JpnEra(new Date(2019, 4, 1));
var jpnEraSignMap = new Map([
    ['明治', meiji],
    ['m', meiji],
    ['M', meiji],
    ['Ｍ', meiji],
    ['大正', taisho],
    ['t', taisho],
    ['T', taisho],
    ['Ｔ', taisho],
    ['昭和', showa],
    ['s', showa],
    ['S', showa],
    ['Ｓ', showa],
    ['平成', heisei],
    ['h', heisei],
    ['H', heisei],
    ['Ｈ', heisei],
    ['令和', reiwa],
    ['r', reiwa],
    ['R', reiwa],
    ['Ｒ', reiwa],
]);
var jpnEraSigns = Array.from(jpnEraSignMap.keys());
// this regexp includes [:], [/], [-], [.], [\s], [．], [年], [月], [日]
var dateSeparatorReg = '[:\\/\\-\\.\\s．年月日]';
function parseJpnDateString(dateString) {
    // convert number from full-width to half-width
    var converted = dateString.replace(/[０-９．]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    var matchedJpnEra = converted.match("^(" + jpnEraSigns.join('|') + ")([0-9]{1,2})(" + dateSeparatorReg + ")([0-9]{1,2})(" + dateSeparatorReg + ")([0-9]{1,2})(" + dateSeparatorReg + "?)$");
    if (matchedJpnEra) {
        // parse as japanese era
        var eraSign = matchedJpnEra[1];
        var year = Number(matchedJpnEra[2]);
        var month = Number(matchedJpnEra[4]);
        var date = Number(matchedJpnEra[6]);
        var jpnEra = jpnEraSignMap.get(eraSign);
        if (jpnEra) {
            return new Date(jpnEra.getADYear(year), month - 1, date);
        }
    }
    var matchedAD = converted.match("^([0-9]{4})(" + dateSeparatorReg + ")?([0-9]{1,2})(" + dateSeparatorReg + ")?([0-9]{1,2})(" + dateSeparatorReg + ")?");
    if (matchedAD) {
        // parse as A.D.
        var year = Number(matchedAD[1]);
        var month = Number(matchedAD[3]);
        var date = Number(matchedAD[5]);
        return new Date(year, month - 1, date);
    }
    return dayjs_1.default(converted).toDate();
}
exports.parseJpnDateString = parseJpnDateString;
//# sourceMappingURL=datePickerHelper.js.map