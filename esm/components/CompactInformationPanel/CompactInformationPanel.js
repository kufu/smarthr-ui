import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { FaCheckCircleIcon, FaExclamationCircleIcon, FaInfoCircleIcon, WarningIcon as shrWarningIcon, } from '../Icon';
import { useClassNames } from './useClassNames';
export const CompactInformationPanel = ({ type = 'info', className = '', children, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, themes: theme },
        callIcon(type, theme),
        React.createElement(Content, { className: classNames.content }, children)));
};
const callIcon = (type, theme) => {
    const { color } = theme;
    switch (type) {
        case 'info':
        default:
            return React.createElement(InfoIcon, { color: color.TEXT_GREY, "$theme": theme });
        case 'success':
            return React.createElement(SuccessIcon, { color: color.MAIN, "$theme": theme });
        case 'warning':
            return React.createElement(WarningIcon, { color: color.WARNING, "$theme": theme });
        case 'error':
            return React.createElement(ErrorIcon, { color: color.DANGER, "$theme": theme });
    }
};
const createIcon = (Icon) => styled(Icon)(({ $theme: { spacingByChar } }) => css `
      flex-shrink: 0;

      /*
      it set line-height to 1.5 and align-items(flexbox) to start(default),
      translate-y 0.25em transform for leading
      */
      transform: translateY(0.25em);
      margin-right: ${spacingByChar(0.5)};
    `);
const InfoIcon = createIcon(FaInfoCircleIcon);
const SuccessIcon = createIcon(FaCheckCircleIcon);
const WarningIcon = createIcon(shrWarningIcon);
const ErrorIcon = createIcon(FaExclamationCircleIcon);
const Wrapper = styled(Base) `
  ${({ themes: { spacingByChar, shadow } }) => {
    return css `
      display: flex;
      box-shadow: ${shadow.LAYER3};
      padding: ${spacingByChar(1)};
    `;
}}
`;
const Content = styled.div `
  line-height: 1.5;
`;
//# sourceMappingURL=CompactInformationPanel.js.map