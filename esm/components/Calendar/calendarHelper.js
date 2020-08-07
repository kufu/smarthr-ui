import dayjs from 'dayjs';
export var daysInWeek = ['日', '月', '火', '水', '木', '金', '土'];
export function getFromDate(date) {
    var min = new Date(1970, 0, 1);
    if (!date || isNaN(date.getTime()) || date.getTime() < 0) {
        return min;
    }
    return date;
}
export function getToDate(date) {
    if (!date || isNaN(date.getTime())) {
        return dayjs().add(50, 'year').toDate();
    }
    var max = new Date(9999, 11, 31);
    if (date.getTime() > max.getTime()) {
        return max;
    }
    return date;
}
export function getMonthArray(date) {
    var startDay = dayjs(date).date(1).day();
    var lastDate = dayjs(date).add(1, 'month').date(0).date();
    var numOfWeek = Math.ceil((lastDate + startDay) / 7);
    return Array.from({ length: numOfWeek }).map(function (_, weekIndex) {
        // 週毎の配列を形成
        var startDateInWeek = weekIndex * 7 - startDay + 1;
        return Array.from({ length: 7 }).map(function (__, dateIndex) {
            // 1週の配列を形成
            var dateNum = startDateInWeek + dateIndex;
            if (dateNum > 0 && dateNum <= lastDate) {
                return dateNum;
            }
            return null;
        });
    });
}
export function isBetween(date, from, to) {
    var time = date.getTime();
    var fromTime = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
    var toTime = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1).getTime();
    return time >= fromTime && time < toTime;
}
//# sourceMappingURL=calendarHelper.js.map