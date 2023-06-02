import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { CheckBox } from '../CheckBox';
import { Center } from '../Layout';
import { VisuallyHiddenText } from '../VisuallyHiddenText';
import { Th as shrTh } from './Th';
const CHECK_ALL_INVISIBLE_LABEL = 'すべての行を選択';
export const ThCheckbox = forwardRef(({ decorators, className, ...others }, ref) => {
    const theme = useTheme();
    return (
    // Th に必要な属性やイベントは不要
    React.createElement(Th, { themes: theme, className: className },
        React.createElement(Label, null,
            React.createElement(CheckBox, { ...others, ref: ref }),
            React.createElement(VisuallyHiddenText, null, decorators?.checkAllInvisibleLabel?.(CHECK_ALL_INVISIBLE_LABEL) ||
                CHECK_ALL_INVISIBLE_LABEL))));
});
const Th = styled(shrTh) `
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
//# sourceMappingURL=ThCheckbox.js.map