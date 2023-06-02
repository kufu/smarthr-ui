import React from 'react';
import styled, { css } from 'styled-components';
import { useSpacing } from '../../hooks/useSpacing';
import { useTheme } from '../../hooks/useTheme';
import { Base as shrBase } from '../Base';
import { Cluster, LineUp } from '../Layout';
import { Text } from '../Text';
import { useClassNames } from './useClassNames';
export const FloatArea = ({ primaryButton, secondaryButton, tertiaryButton, errorText, errorIcon, fixed = false, className = '', width, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Base, { ...props, themes: theme, className: `${className} ${classNames.wrapper}`, "$width": width, fixed: fixed },
        React.createElement(Cluster, { gap: 1 },
            tertiaryButton && tertiaryButton,
            React.createElement(RightSide, null,
                React.createElement(Cluster, { gap: 1 },
                    errorText && (React.createElement(ErrorMessage, { gap: 0.25, vAlign: "center", as: "p", className: classNames.errorText },
                        errorIcon && React.createElement(ErrorIcon, { themes: theme }, errorIcon),
                        React.createElement(Text, { size: "S" }, errorText))),
                    React.createElement(Cluster, { gap: 1 },
                        secondaryButton && secondaryButton,
                        primaryButton && primaryButton))))));
};
const Base = styled(shrBase).attrs({ layer: 3 }) `
  ${({ themes: { space }, top, bottom, $width, fixed, zIndex = 500 }) => css `
      position: ${fixed ? 'fixed' : 'sticky'};
      ${(top || top === 0) && `top: ${useSpacing(top)};`}
      ${(bottom || bottom === 0) && `bottom: ${useSpacing(bottom)};`}
      z-index: ${zIndex};
      padding: ${space(1)};
      ${$width && `width: ${$width};`}
    `}
`;
const RightSide = styled.div `
  margin-left: auto;
`;
const ErrorMessage = styled(LineUp) `
  margin-top: 0;
  margin-bottom: 0;
`;
const ErrorIcon = styled.span `
  flex-shrink: 0;

  > svg {
    display: block; /* 隙間対策 */
  }
`;
//# sourceMappingURL=FloatArea.js.map