"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Pagination_1 = require("./Pagination");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(Pagination_1.Pagination.displayName || 'Pagination');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        page: generate('page'),
        current: generate('current'),
        first: generate('first'),
        prev: generate('prev'),
        next: generate('next'),
        last: generate('last'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map