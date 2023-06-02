import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { RadioButton } from '../RadioButton';
import { useClassNames } from './useClassNames';
export const RadioButtonPanel = ({ onClick, as, className, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames(className);
    // 外側の装飾を押しても内側のラジオボタンが押せるようにする
    const innerRef = useRef(null);
    const handleOuterClick = () => {
        innerRef.current?.click();
    };
    return (React.createElement(Wrapper, { onClick: handleOuterClick, forwardedAs: as, themes: theme, className: classNames.wrapper },
        React.createElement(RadioButton, { ...props, ref: innerRef })));
};
const Wrapper = styled(Base).attrs({ padding: 1 }) `
  ${({ themes: { shadow, space } }) => css `
    :not(:has([disabled])) {
      cursor: pointer;
    }

    /* :focus-visible-within の代替 */
    :has(:focus-visible) {
      ${shadow.focusIndicatorStyles}
    }

    .smarthr-ui-RadioButton-radioButton:focus + span {
      box-shadow: revert;
    }

    .smarthr-ui-RadioButton-label {
      /* 視覚的な調整 */
      margin-inline-start: ${space(0.75)};
    }
  `}
`;
//# sourceMappingURL=RadioButtonPanel.js.map