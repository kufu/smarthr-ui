import React from 'react';
import styled, { css } from 'styled-components';
import { useSpacing } from '../../hooks/useSpacing';
import { useTheme } from '../../hooks/useTheme';
import { VisuallyHiddenText } from '../VisuallyHiddenText';
import { useClassNames } from './useClassNames';
export const generateIcon = (svg) => createIcon(svg);
const definedColors = [
    'TEXT_BLACK',
    'TEXT_WHITE',
    'TEXT_GREY',
    'TEXT_DISABLED',
    'TEXT_LINK',
    'MAIN',
    'DANGER',
    'WARNING',
    'BRAND',
];
const knownColorSet = new Set(definedColors);
const isDefinedColor = (color) => knownColorSet.has(color);
export const createIcon = (SvgIcon) => {
    const Icon = ({ color, className = '', role = 'img', alt, 'aria-hidden': ariaHidden, focusable = false, text, iconGap = 0.25, right = false, ...props }) => {
        const hasLabelByAria = props['aria-label'] !== undefined || props['aria-labelledby'] !== undefined;
        const isAriaHidden = ariaHidden !== undefined ? ariaHidden : !hasLabelByAria;
        const theme = useTheme();
        const replacedColor = React.useMemo(() => {
            const asserted = color;
            if (asserted && isDefinedColor(asserted)) {
                return theme.color[asserted];
            }
            return color;
        }, [color, theme.color]);
        const classNames = useClassNames();
        const existsText = !!text;
        const svgIcon = (React.createElement(SvgIcon, { ...props, stroke: "currentColor", fill: "currentColor", strokeWidth: "0", width: "1em", height: "1em", color: replacedColor, className: `${className} ${classNames.wrapper}`, role: role, "aria-hidden": isAriaHidden || alt !== undefined || undefined, focusable: focusable }));
        if (existsText) {
            return (React.createElement(WithIcon, { gap: iconGap, right: right, className: classNames.withText },
                alt && React.createElement(VisuallyHiddenText, null, alt),
                right && text,
                svgIcon,
                !right && text));
        }
        return (React.createElement(React.Fragment, null,
            alt && React.createElement(VisuallyHiddenText, null, alt),
            svgIcon));
    };
    Icon.displayName = SvgIcon.name;
    return Icon;
};
const WithIcon = styled.span `
  ${({ right, gap }) => css `
    ${!right &&
    css `
      display: inline-flex;
      align-items: baseline;
      ${gap && `column-gap: ${useSpacing(gap)};`}
    `}

    .smarthr-ui-Icon {
      flex-shrink: 0;
      transform: translateY(0.125em);
      ${right && gap && `margin-inline-start: ${useSpacing(gap)};`}
    }
  `}
`;
//# sourceMappingURL=generateIcon.js.map