import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { DatePicker } from './DatePicker';
export const useClassNames = () => {
    const generate = useClassNameGenerator(DatePicker.displayName || 'DatePicker');
    return useMemo(() => ({
        wrapper: generate(),
        inputContainer: generate('inputContainer'),
        calendarContainer: generate('calendarContainer'),
    }), [generate]);
};
//# sourceMappingURL=useClassNames.js.map