import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { CheckBox } from '../CheckBox';
import { Center } from '../Layout';
import { VisuallyHiddenText } from '../VisuallyHiddenText';
import { Td as shrTd } from './Td';
export const TdCheckbox = forwardRef(({ 'aria-labelledby': ariaLabelledby, children, className, ...others }, ref) => {
    const theme = useTheme();
    return (
    // Td に必要な属性やイベントは不要
    React.createElement(Td, { className: className, themes: theme },
        React.createElement(Label, null,
            React.createElement(CheckBox, { ...others, ref: ref, "aria-labelledby": ariaLabelledby }),
            children && React.createElement(VisuallyHiddenText, null, children))));
});
const Td = styled(shrTd) `
  ${({ themes: { fontSize, space } }) => css `
    position: relative;
    padding: ${space(0.75)};
    width: ${fontSize.M};
  `}
`;
const Label = styled(Center).attrs({ as: 'label', verticalCentering: true }) `
  position: absolute;
  inset: 0;

  &:not(:has([disabled])) {
    cursor: pointer;
  }
`;
//# sourceMappingURL=TdCheckbox.js.map