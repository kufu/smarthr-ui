"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBetween = exports.getMonthArray = exports.getToDate = exports.getFromDate = exports.minDate = exports.daysInWeek = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const isBetween_1 = __importDefault(require("dayjs/plugin/isBetween"));
dayjs_1.default.extend(isBetween_1.default);
exports.daysInWeek = ['日', '月', '火', '水', '木', '金', '土'];
exports.minDate = new Date(1900, 0, 1);
const minDatetime = exports.minDate.getTime();
const maxDate = new Date(9999, 11, 31);
const maxDatetime = maxDate.getTime();
function getFromDate(date) {
    const time = date.getTime();
    return isNaN(time) || time < minDatetime ? exports.minDate : date;
}
exports.getFromDate = getFromDate;
function getToDate(date) {
    if (!date) {
        return (0, dayjs_1.default)().add(50, 'year').toDate();
    }
    const time = date.getTime();
    if (isNaN(time)) {
        return (0, dayjs_1.default)().add(50, 'year').toDate();
    }
    return time > maxDatetime ? maxDate : date;
}
exports.getToDate = getToDate;
function getMonthArray(date) {
    const startDay = (0, dayjs_1.default)(date).date(1).day();
    const lastDate = (0, dayjs_1.default)(date).add(1, 'month').date(0).date();
    const numOfWeek = Math.ceil((lastDate + startDay) / 7);
    return Array.from({ length: numOfWeek }).map((_, weekIndex) => {
        // 週毎の配列を形成
        const startDateInWeek = weekIndex * 7 - startDay + 1;
        return Array.from({ length: 7 }).map((__, dateIndex) => {
            // 1週の配列を形成
            const dateNum = startDateInWeek + dateIndex;
            return dateNum > 0 && dateNum <= lastDate ? dateNum : null;
        });
    });
}
exports.getMonthArray = getMonthArray;
function isBetween(date, from, to) {
    return (0, dayjs_1.default)(date).isBetween(from, to, 'day', '[]');
}
exports.isBetween = isBetween;
//# sourceMappingURL=calendarHelper.js.map