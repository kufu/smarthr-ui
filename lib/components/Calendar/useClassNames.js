"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Calendar_1 = require("./Calendar");
const CalendarTable_1 = require("./CalendarTable");
const YearPicker_1 = require("./YearPicker");
const useClassNames = () => {
    const generateCalendar = (0, useClassNameGenerator_1.useClassNameGenerator)(Calendar_1.Calendar.displayName || 'Calendar');
    const generateYearPicker = (0, useClassNameGenerator_1.useClassNameGenerator)(YearPicker_1.YearPicker.displayName || 'YearPicker');
    const generateCalendarTable = (0, useClassNameGenerator_1.useClassNameGenerator)(CalendarTable_1.CalendarTable.displayName || 'CalendarTable');
    return (0, react_1.useMemo)(() => ({
        calendar: {
            wrapper: generateCalendar(),
            header: generateCalendar('header'),
            yearMonth: generateCalendar('yearMonth'),
            selectingYear: generateCalendar('selectingYear'),
            monthButtons: generateCalendar('monthButtons'),
            monthButtonPrev: generateCalendar('monthButtonPrev'),
            monthButtonNext: generateCalendar('monthButtonNext'),
        },
        yearPicker: {
            wrapper: generateYearPicker(),
            selectYear: generateYearPicker('selectYear'),
        },
        calendarTable: {
            wrapper: generateCalendarTable(),
            headCell: generateCalendarTable('headCell'),
            dataCell: generateCalendarTable('dataCell'),
        },
    }), [generateCalendar, generateYearPicker, generateCalendarTable]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map