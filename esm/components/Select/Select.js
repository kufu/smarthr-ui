import React, { forwardRef, useCallback, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { isMobileSafari } from '../../libs/ua';
import { FaSortIcon } from '../Icon';
import { useClassNames } from './useClassNames';
const BLANK_LABEL = '選択してください';
export const Select = forwardRef(({ options, onChange, onChangeValue, error = false, width = 'auto', hasBlank = false, decorators, size = 'default', className = '', disabled, ...props }, ref) => {
    const theme = useTheme();
    const widthStyle = typeof width === 'number' ? `${width}px` : width;
    const handleChange = useCallback((e) => {
        if (onChange)
            onChange(e);
        if (onChangeValue) {
            const flattenOptions = options.reduce((pre, cur) => pre.concat('value' in cur ? cur : cur.options), []);
            const selectedOption = flattenOptions.find((option) => option.value === e.target.value);
            if (selectedOption) {
                onChangeValue(selectedOption.value);
            }
        }
    }, [onChange, onChangeValue, options]);
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { className: `${className} ${classNames.wrapper} ${generateSizeClassName(size)}`, "$width": widthStyle },
        React.createElement(StyledSelect, { ...props, onChange: handleChange, "aria-invalid": error || undefined, themes: theme, error: error, disabled: disabled, ref: ref },
            hasBlank && (React.createElement("option", { value: "" }, decorators?.blankLabel?.(BLANK_LABEL) || BLANK_LABEL)),
            options.map((option) => {
                if ('value' in option) {
                    return (React.createElement("option", { ...option, key: option.value }, option.label));
                }
                const { options: groupedOptions, ...optgroup } = option;
                return (React.createElement("optgroup", { ...optgroup, key: optgroup.label }, groupedOptions.map((groupedOption) => (React.createElement("option", { ...groupedOption, key: groupedOption.value }, groupedOption.label)))));
            }),
            // Support for not omitting labels in Mobile Safari
            isMobileSafari && React.createElement(BlankOptgroup, null)),
        React.createElement(IconWrap, { themes: theme },
            React.createElement(FaSortIcon, null))));
});
const generateSizeClassName = (size) => (size === 's' ? '--small' : '');
const Wrapper = styled.div `
  ${({ $width }) => css `
    position: relative;
    box-sizing: border-box;
    width: ${$width};
  `}
`;
const StyledSelect = styled.select `
  ${({ error, themes: { border, color, fontSize, leading, radius, shadow, spacingByChar } }) => css `
    appearance: none;
    cursor: pointer;
    outline: none;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${color.WHITE};
    padding-inline: ${spacingByChar(0.5)} ${spacingByChar(2)};
    font-size: ${fontSize.M};
    line-height: ${leading.NONE};
    color: ${color.TEXT_BLACK};
    width: 100%;
    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    /* padding に依る積み上げでは文字が見切れてしまうため */
    min-height: calc(${fontSize.M} + ${spacingByChar(0.75)} * 2 + ${border.lineWidth} * 2);

    ${error &&
    css `
      border-color: ${color.DANGER};
    `}

    &:hover {
      background-color: ${color.hoverColor(color.WHITE)};
    }

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }

    &:disabled {
      pointer-events: none;
      opacity: 1;
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.hoverColor(color.WHITE)};
      color: ${color.TEXT_DISABLED};
    }

    .--small & {
      padding-inline: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};

      /* padding に依る積み上げでは文字が見切れてしまうため */
      min-height: calc(${fontSize.S} + ${spacingByChar(0.5)} * 2 + ${border.lineWidth} * 2);
    }
  `}
`;
const IconWrap = styled.span `
  ${({ themes: { color, fontSize, spacingByChar } }) => css `
    pointer-events: none;
    position: absolute;
    top: 0;
    right: ${spacingByChar(0.75)};
    bottom: 0;
    display: inline-flex;
    align-items: center;
    color: ${color.TEXT_GREY};

    ${StyledSelect}:disabled + & {
      color: ${color.TEXT_DISABLED};
    }
    ${StyledSelect}:focus-visible + & {
      color: ${color.TEXT_BLACK};
    }

    .--small & {
      right: ${spacingByChar(0.5)};
      font-size: ${fontSize.S};
    }
  `}
`;
const BlankOptgroup = styled.optgroup `
  display: none;
`;
//# sourceMappingURL=Select.js.map