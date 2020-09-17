import * as React from 'react';
import { TableGroupContext } from './Table';
export var Head = function (_a) {
    var _b = _a.className, className = _b === void 0 ? '' : _b, children = _a.children;
    return (React.createElement("thead", { className: className },
        React.createElement(TableGroupContext.Provider, { value: { group: 'head' } }, children)));
};
//# sourceMappingURL=Head.js.map