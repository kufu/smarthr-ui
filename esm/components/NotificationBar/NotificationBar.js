import React, { useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../Button';
import { FaCheckCircleIcon, FaExclamationCircleIcon, FaExclamationTriangleIcon, FaInfoCircleIcon, FaTimesIcon, WarningIcon, } from '../Icon';
import { Cluster } from '../Layout';
import { Text } from '../Text';
import { useClassNames } from './useClassNames';
export const messageTypes = ['info', 'success', 'error', 'warning'];
export const NotificationBar = ({ type, bold = false, message, onClose, children, role = type === 'info' ? 'status' : 'alert', className = '', ...props }) => {
    const theme = useTheme();
    const { color } = theme;
    const classNames = useClassNames();
    const { Icon, iconColor, ...colorSet } = useMemo(() => {
        switch (type) {
            case 'info':
                return {
                    Icon: FaInfoCircleIcon,
                    iconColor: color.TEXT_GREY,
                };
            case 'success': {
                const colors = bold
                    ? {
                        iconColor: color.TEXT_WHITE,
                        fgColor: color.TEXT_WHITE,
                        bgColor: color.MAIN,
                    }
                    : {};
                return {
                    Icon: FaCheckCircleIcon,
                    iconColor: color.MAIN,
                    ...colors,
                };
            }
            case 'warning': {
                const colors = bold
                    ? {
                        Icon: FaExclamationTriangleIcon,
                        fgColor: color.TEXT_BLACK,
                        bgColor: color.WARNING_YELLOW,
                    }
                    : {};
                return {
                    Icon: WarningIcon,
                    iconColor: color.TEXT_BLACK,
                    ...colors,
                };
            }
            case 'error': {
                const colors = bold
                    ? {
                        iconColor: color.TEXT_WHITE,
                        fgColor: color.TEXT_WHITE,
                        bgColor: color.DANGER,
                    }
                    : {};
                return {
                    Icon: FaExclamationCircleIcon,
                    iconColor: color.DANGER,
                    ...colors,
                };
            }
        }
    }, [color, type, bold]);
    return (React.createElement(Wrapper, { ...props, className: `${type} ${classNames.wrapper}${className && ` ${className}`}`, role: role, themes: theme, colorSet: colorSet },
        React.createElement(MessageArea, { themes: theme, className: classNames.messageArea },
            React.createElement(IconLayout, null,
                React.createElement(Icon, { color: iconColor })),
            React.createElement(StyledText, { leading: "TIGHT" }, message)),
        React.createElement(ActionArea, { themes: theme, className: classNames.actionArea },
            children && (React.createElement(ActionWrapper, { themes: theme, className: classNames.actions, align: "center", justify: "flex-end" }, children)),
            onClose && (React.createElement(CloseButton, { variant: "text", colorSet: colorSet, themes: theme, onClick: onClose, className: classNames.closeButton, size: "s" },
                React.createElement(FaTimesIcon, { alt: "\u9589\u3058\u308B" }))))));
};
const Wrapper = styled.div(({ themes: { color, fontSize, leading, space }, colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE }, animate, }) => css `
    display: flex;
    gap: ${space(1)};
    align-items: center;
    background-color: ${bgColor};
    padding: ${space(0.75)};
    color: ${fgColor};
    ${animate &&
    css `
      /* 1行の場合の高さ分だけスライドさせる */
      /* stylelint-disable-next-line */
      animation: ${slideIn(`calc(${fontSize.M} * ${leading.TIGHT} + ${space(1.5)})`)} 0.2s ease-out;
    `}
  `);
const slideIn = (translateLength) => keyframes `
  from {
    opacity: 0;
    transform: translateY(calc(-1 * ${translateLength}));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const MessageArea = styled.div(({ themes: { spacingByChar } }) => css `
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-grow: 1;

    /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
    min-width: 0;
  `);
const IconLayout = styled.div `
  /* 子のアイコンの line-height を打ち消すために指定 */
  display: flex;
`;
const StyledText = styled(Text) `
  /* flexbox で ellipsis するために min-width をつけて幅の計算を発生させている */
  min-width: 0;
`;
const ActionArea = styled.div(({ themes: { spacingByChar } }) => css `
    display: flex;
    gap: ${spacingByChar(0.5)};
    align-items: center;
    flex-shrink: 0;
  `);
const ActionWrapper = styled(Cluster)(({ themes: { spacingByChar } }) => css `
    margin-top: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
  `);
const CloseButton = styled(Button)(({ themes: { color, spacingByChar }, colorSet: { fgColor = color.TEXT_BLACK, bgColor = color.WHITE }, }) => css `
    flex-shrink: 0;

    margin-top: ${spacingByChar(-0.5)};
    margin-right: ${spacingByChar(-0.5)};
    margin-bottom: ${spacingByChar(-0.5)};
    color: ${fgColor};

    &:hover,
    &:focus-visible {
      background-color: ${color.hoverColor(bgColor)};
      color: ${fgColor};
    }
  `);
//# sourceMappingURL=NotificationBar.js.map