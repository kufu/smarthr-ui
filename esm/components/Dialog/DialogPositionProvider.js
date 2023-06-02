import React, { createContext } from 'react';
export const PositionContext = createContext({});
export const DialogPositionProvider = ({ top, bottom, children }) => {
    return (React.createElement(PositionContext.Provider, { value: {
            top,
            bottom,
        } }, children));
};
//# sourceMappingURL=DialogPositionProvider.js.map