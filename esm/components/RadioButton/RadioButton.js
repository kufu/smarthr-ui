import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { RadioButtonInput } from './RadioButtonInput';
import { useClassNames } from './useClassNames';
export const RadioButton = forwardRef(({ lineHeight = 1.5, children, className = '', ...props }, ref) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const radioButtonId = useId(props.id);
    if (!children) {
        return (React.createElement(Wrapper, { className: `${className} ${classNames.wrapper}`, themes: theme },
            React.createElement(RadioButtonInput, { ...props, ref: ref, className: classNames.radioButton })));
    }
    return (React.createElement(Wrapper, { className: `${className} ${classNames.wrapper}`, themes: theme },
        React.createElement(ButtonLayout, { "$height": `${lineHeight}em` },
            React.createElement(RadioButtonInput, { ...props, ref: ref, id: radioButtonId })),
        React.createElement(Label, { htmlFor: radioButtonId, className: `${props.disabled ? 'disabled' : ''} ${classNames.label}`, "$lineHeight": lineHeight, themes: theme }, children)));
});
const Wrapper = styled.div `
  ${({ themes: { fontSize } }) => css `
    display: inline-flex;
    align-items: start;
    font-size: ${fontSize.M};
  `}
`;
const ButtonLayout = styled.div `
  ${({ $height }) => css `
    display: flex;
    align-items: center;
    height: ${$height};
  `}
`;
const Label = styled.label `
  ${({ themes, $lineHeight }) => {
    const { spacingByChar, color } = themes;
    return css `
      margin-left: ${spacingByChar(0.5)};
      color: ${color.TEXT_BLACK};
      line-height: ${$lineHeight};
      cursor: pointer;

      &.disabled {
        color: ${color.TEXT_DISABLED};
        cursor: not-allowed;
      }
    `;
}}
`;
//# sourceMappingURL=RadioButton.js.map