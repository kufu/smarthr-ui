import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Calendar } from './Calendar';
import { CalendarTable } from './CalendarTable';
import { YearPicker } from './YearPicker';
export const useClassNames = () => {
    const generateCalendar = useClassNameGenerator(Calendar.displayName || 'Calendar');
    const generateYearPicker = useClassNameGenerator(YearPicker.displayName || 'YearPicker');
    const generateCalendarTable = useClassNameGenerator(CalendarTable.displayName || 'CalendarTable');
    return useMemo(() => ({
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
//# sourceMappingURL=useClassNames.js.map