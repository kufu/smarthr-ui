import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
export const Input = forwardRef(({ onFocus, onBlur, autoFocus, prefix, suffix, className = '', width, readOnly, bgColor, ...props }, ref) => {
    const theme = useTheme();
    const innerRef = useRef(null);
    useImperativeHandle(ref, () => innerRef.current);
    const handleFocus = useMemo(() => {
        if (!onFocus) {
            return undefined;
        }
        return (e) => onFocus(e);
    }, [onFocus]);
    const handleBlur = useMemo(() => {
        if (!onBlur) {
            return undefined;
        }
        return (e) => onBlur(e);
    }, [onBlur]);
    const handleWheel = useMemo(() => (props.type === 'number' ? disableWheel : undefined), [props.type]);
    useEffect(() => {
        if (autoFocus && innerRef.current) {
            innerRef.current.focus();
        }
    }, [autoFocus]);
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { themes: theme, "$width": width, "$readOnly": readOnly, bgColor: bgColor, "$disabled": props.disabled, error: props.error, onClick: () => innerRef.current?.focus(), className: `${className} ${classNames.wrapper}` },
        prefix && (React.createElement(Affix, { themes: theme, className: classNames.prefix }, prefix)),
        React.createElement(StyledInput, { ...props, onFocus: handleFocus, onBlur: handleBlur, onWheel: handleWheel, readOnly: readOnly, ref: innerRef, themes: theme, "aria-invalid": props.error || undefined, className: classNames.input }),
        suffix && (React.createElement(Affix, { themes: theme, className: classNames.suffix }, suffix))));
});
const disableWheel = (e) => {
    // wheel イベントに preventDefault はないため
    e.target && e.target.blur();
};
const Wrapper = styled.span `
  ${({ themes: { border, color, radius, shadow, space }, $width = 'auto', $readOnly, $disabled, error, bgColor, }) => css `
    cursor: text;
    box-sizing: border-box;
    display: inline-flex;
    gap: ${space(0.5)};
    align-items: center;
    border-radius: ${radius.m};
    border: ${border.shorthand};
    background-color: ${bgColor ? color[bgColor] : color.WHITE};
    padding-inline: ${space(0.5)};
    width: ${typeof $width === 'number' ? `${$width}px` : $width};

    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    &:focus-within {
      ${shadow.focusIndicatorStyles};
    }

    ${error &&
    css `
      border-color: ${color.DANGER};
    `}
    ${$readOnly &&
    css `
      border-color: ${bgColor ? color[bgColor] : color.BACKGROUND};
      background-color: ${bgColor ? color[bgColor] : color.BACKGROUND};
    `}
    ${$disabled &&
    css `
      pointer-events: none;
      border-color: ${color.disableColor(color.BORDER)};
      background-color: ${color.hoverColor(color.WHITE)};
    `}
  `}
`;
const StyledInput = styled.input `
  ${({ themes: { fontSize, leading, color, space } }) => css `
    flex-grow: 1;

    display: inline-block;
    outline: none;
    border: none;
    background-color: transparent;
    padding-block: ${space(0.75)};
    font-size: ${fontSize.M};
    line-height: ${leading.NONE};
    color: ${color.TEXT_BLACK};
    width: 100%;

    /* font-size * line-height で高さが思うように行かないので、相対値の font-size で高さを指定 */
    height: ${fontSize.M};

    &::placeholder {
      color: ${color.TEXT_GREY};
    }

    &[disabled] {
      color: ${color.TEXT_DISABLED};
      -webkit-text-fill-color: ${color.TEXT_DISABLED};
      opacity: 1;
    }
  `}
`;
const Affix = styled.span `
  ${({ themes: { color } }) => css `
    flex-shrink: 0;

    display: flex;
    align-items: center;
    color: ${color.TEXT_GREY};
  `}
`;
//# sourceMappingURL=Input.js.map