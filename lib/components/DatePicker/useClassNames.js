"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const DatePicker_1 = require("./DatePicker");
const useClassNames = () => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(DatePicker_1.DatePicker.displayName || 'DatePicker');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        inputContainer: generate('inputContainer'),
        calendarContainer: generate('calendarContainer'),
    }), [generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map