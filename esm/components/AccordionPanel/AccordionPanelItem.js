import React, { createContext } from 'react';
export var AccordionPanelItemContext = createContext({
    name: '',
});
export var AccordionPanelItem = function (_a) {
    var name = _a.name, children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (React.createElement(AccordionPanelItemContext.Provider, { value: {
            name: name,
        } },
        React.createElement("div", { className: className }, children)));
};
//# sourceMappingURL=AccordionPanelItem.js.map