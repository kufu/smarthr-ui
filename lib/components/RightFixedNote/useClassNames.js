"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const RightFixedNote_1 = require("./RightFixedNote");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(RightFixedNote_1.RightFixedNote.displayName || 'RightFixedNote');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        title: generate('title'),
        item: generate('item'),
        itemEditButton: generate('itemEditButton'),
        itemText: generate('itemText'),
        itemDate: generate('itemDate'),
        itemAuthor: generate('itemAuthor'),
        textarea: generate('textarea'),
        submitButton: generate('submitButton'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map