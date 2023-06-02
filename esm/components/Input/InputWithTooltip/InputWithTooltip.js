import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { Tooltip as shrTooltip } from '../../Tooltip';
import { Input } from '../Input';
export const InputWithTooltip = forwardRef(({ tooltipMessage, width, ...props }, ref) => {
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    return (React.createElement(Tooltip, { width: widthStyle, message: tooltipMessage, tabIndex: -1, ariaDescribedbyTarget: "inner" },
        React.createElement(Input, { ...props, width: widthStyle, ref: ref })));
});
const Tooltip = styled(shrTooltip)(({ width }) => css `
    /* Input のフォーカスリングを表示するため */
    overflow: revert;
    ${width && `width: ${width};`}
  `);
//# sourceMappingURL=InputWithTooltip.js.map