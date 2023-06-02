import React, { createContext, useState } from 'react';
export const DialogContext = createContext({
    onClickTrigger: () => {
        /* noop */
    },
    onClickClose: () => {
        /* noop */
    },
    active: false,
});
export const DialogWrapper = ({ children }) => {
    const [active, setActive] = useState(false);
    return (React.createElement(DialogContext.Provider, { value: {
            onClickTrigger: () => setActive(true),
            onClickClose: () => setActive(false),
            active,
        } }, children));
};
//# sourceMappingURL=DialogWrapper.js.map