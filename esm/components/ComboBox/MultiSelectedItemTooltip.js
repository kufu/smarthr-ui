import React from 'react';
import { Tooltip } from '../Tooltip';
export const MultiSelectedItemTooltip = ({ needsTooltip, text, children }) => {
    return needsTooltip ? (React.createElement(Tooltip, { message: text, multiLine: true }, children)) : (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    React.createElement(React.Fragment, null, children));
};
//# sourceMappingURL=MultiSelectedItemTooltip.js.map