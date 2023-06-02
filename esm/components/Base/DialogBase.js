import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
const radiusMap = {
    s: '6px',
    m: '8px',
};
/**
 * @deprecated The DialogBase component is deprecated, so use Base component instead.
 */
export const DialogBase = forwardRef(({ radius = 'm', className = '', ...props }, ref) => {
    const themes = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.dialogBase.wrapper}`, themes: themes, "$radius": radiusMap[radius], ref: ref }));
});
const Wrapper = styled.div `
  ${({ themes: { color, shadow }, $radius }) => {
    return css `
      box-shadow: ${shadow.LAYER3};
      border-radius: ${$radius};
      background-color: ${color.WHITE};
    `;
}}
`;
//# sourceMappingURL=DialogBase.js.map