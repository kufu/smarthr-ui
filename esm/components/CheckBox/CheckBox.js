import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { CheckBoxInput } from './CheckBoxInput';
import { useClassNames } from './useClassNames';
export const CheckBox = forwardRef(({ lineHeight = 1.5, className = '', children, ...props }, ref) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const checkBoxId = useId(props.id);
    if (!children)
        return (React.createElement(Wrapper, { className: `${className} ${classNames.wrapper}` },
            React.createElement(CheckBoxInput, { ...props, ref: ref })));
    return (React.createElement(Wrapper, { className: `${className} ${classNames.wrapper}` },
        React.createElement(CheckBoxInput, { ...props, ref: ref, id: checkBoxId }),
        React.createElement(Label, { className: `${props.disabled ? 'disabled' : ''} ${classNames.label}`, htmlFor: checkBoxId, "$lineHeight": lineHeight, themes: theme }, children)));
});
// Use flex-start to support multi-line text.
const Wrapper = styled.div `
  display: inline-flex;
  align-items: flex-start;
`;
const Label = styled.label `
  ${({ themes, $lineHeight }) => {
    const { spacingByChar, color, fontSize } = themes;
    return css `
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      font-size: ${fontSize.M};
      line-height: ${$lineHeight};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
        pointer-events: none;
      }

      /* Since the positions of checkbox and text are misaligned, create a pseudo element that adjusts the line-height. */
      &::before {
        display: block;
        width: 0;
        height: 0;
        margin-top: calc((1 - ${$lineHeight}) * 0.4em);
        content: '';
      }
    `;
}}
`;
//# sourceMappingURL=CheckBox.js.map