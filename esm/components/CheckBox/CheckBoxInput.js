import { transparentize } from 'polished';
import React, { forwardRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { FaCheckIcon, FaMinusIcon } from '../Icon';
import { useClassNames } from './useClassNames';
export const CheckBoxInput = forwardRef(({ mixed = false, onChange, ...props }, ref) => {
    const theme = useTheme();
    const { checked, disabled } = props;
    const boxClassName = `${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`;
    const handleChange = useCallback((e) => {
        if (onChange)
            onChange(e);
    }, [onChange]);
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { themes: theme },
        React.createElement(Input, { ...props, ...(mixed && { 'aria-checked': 'mixed' }), type: "checkbox", onChange: handleChange, className: classNames.checkBox, themes: theme, ref: ref, "aria-invalid": props.error || undefined }),
        React.createElement(Box, { className: boxClassName, themes: theme, error: props.error }),
        React.createElement(IconWrap, { themes: theme }, mixed ? React.createElement(FaMinusIcon, { color: "TEXT_WHITE" }) : React.createElement(FaCheckIcon, { color: "TEXT_WHITE" }))));
});
const Wrapper = styled.span `
  ${({ themes }) => {
    const { fontSize } = themes;
    return css `
      position: relative;
      display: inline-block;
      width: ${fontSize.M};
      height: ${fontSize.M};
      flex-shrink: 0;
      line-height: 1;
      box-sizing: border-box;
    `;
}}
`;
const Box = styled.span `
  ${({ themes, error }) => {
    const { border, color } = themes;
    return css `
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      border: ${border.shorthand};
      background-color: ${color.WHITE};
      box-sizing: border-box;
      pointer-events: none;

      @media (prefers-contrast: more) {
        & {
          border: ${border.highContrast};
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input:checked + && {
        border-color: ${color.MAIN};
        background-color: ${color.MAIN};
        @media (prefers-contrast: more) {
          & {
            border: ${border.highContrast};
          }
        }
      }

      /* FIXME: なぜか static classname になってしまうため & を重ねている */
      input[disabled] + && {
        background-color: ${color.BORDER};
        border-color: ${color.BORDER};
      }

      ${error &&
        css `
        border-color: ${color.DANGER};
      `}
    `;
}}
`;
const Input = styled.input `
  ${({ themes }) => {
    const { shadow, color } = themes;
    return css `
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      cursor: pointer;
      &[disabled] {
        pointer-events: none;
      }
      &:hover:not([disabled]) + span {
        box-shadow: 0 0 0 2px ${transparentize(0.78, color.MAIN)};
      }
      &:focus-visible + span {
        ${shadow.focusIndicatorStyles};
      }
    `;
}}
`;
const IconWrap = styled.span `
  ${({ themes }) => {
    const { fontSize } = themes;
    return css `
      position: absolute;
      top: 50%;
      left: 50%;
      display: inline-block;
      width: ${fontSize.XXS};
      height: ${fontSize.XXS};
      font-size: ${fontSize.XXS};
      transform: translate(-50%, -50%);
      pointer-events: none;

      input:not(:checked) ~ & > svg {
        fill: transparent;
      }

      & > svg {
        vertical-align: top;
      }
    `;
}}
`;
//# sourceMappingURL=CheckBoxInput.js.map