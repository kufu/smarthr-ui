import React, { createContext } from 'react';
import { useClassNames } from './useClassNames';
export const AccordionPanelItemContext = createContext({
    name: '',
});
export const AccordionPanelItem = ({ name, children, className = '', ...props }) => {
    const classNames = useClassNames();
    return (React.createElement(AccordionPanelItemContext.Provider, { value: {
            name,
        } },
        React.createElement("div", { ...props, className: `${className} ${classNames.item}` }, children)));
};
//# sourceMappingURL=AccordionPanelItem.js.map