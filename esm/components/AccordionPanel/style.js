import React from 'react';
import { AccordionPanel, AccordionPanelContent, AccordionPanelItem, AccordionPanelTrigger } from '.';
export const Style = () => (React.createElement(AccordionPanel, null,
    React.createElement(AccordionPanelItem, { name: "item1" },
        React.createElement(AccordionPanelTrigger, null, "Trigger"),
        React.createElement(AccordionPanelContent, null, "Content"))));
export const PREFIX = 'AccordionPanel';
//# sourceMappingURL=style.js.map