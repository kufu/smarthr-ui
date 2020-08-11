import React, { createContext } from 'react';
export var PositionContext = createContext({});
export var DialogPositionProvider = function (_a) {
    var top = _a.top, bottom = _a.bottom, children = _a.children;
    return (React.createElement(PositionContext.Provider, { value: {
            top: top,
            bottom: bottom,
        } }, children));
};
//# sourceMappingURL=DialogPositionProvider.js.map