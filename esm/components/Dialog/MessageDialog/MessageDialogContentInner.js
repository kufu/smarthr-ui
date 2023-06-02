import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../Button';
import { Stack } from '../../Layout';
import { Text } from '../../Text';
import { useOffsetHeight } from '../dialogHelper';
import { useClassNames } from '../useClassNames';
const CLOSE_BUTTON_LABEL = '閉じる';
export const MessageDialogContentInner = ({ title, subtitle, titleTag = 'h2', titleId, description, onClickClose, decorators, }) => {
    const classNames = useClassNames().dialog;
    const theme = useTheme();
    const { offsetHeight, titleRef, bottomRef } = useOffsetHeight();
    return (React.createElement(React.Fragment, null,
        React.createElement(TitleArea, { gap: 0.25, themes: theme, ref: titleRef, className: classNames.titleArea, as: titleTag },
            subtitle && (React.createElement(Text, { size: "S", leading: "TIGHT", color: "TEXT_GREY", className: classNames.subtitle }, subtitle)),
            React.createElement(Text, { id: titleId, size: "L", leading: "TIGHT", className: classNames.title }, title)),
        React.createElement(Description, { themes: theme, offsetHeight: offsetHeight, className: classNames.description }, description),
        React.createElement(Bottom, { themes: theme, ref: bottomRef, className: classNames.buttonArea },
            React.createElement(Button, { onClick: onClickClose, className: classNames.closeButton }, decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL))));
};
const TitleArea = styled(Stack)(({ themes: { border, spacing } }) => css `
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${spacing.XS} ${spacing.S};
  `);
const Description = styled.div `
  ${({ themes: { fontSize, spacingByChar }, offsetHeight }) => {
    return css `
      max-height: calc(100vh - ${offsetHeight}px);
      overflow: auto;
      padding: 0 ${spacingByChar(1.5)};
      font-size: ${fontSize.M};
      line-height: 1.5;
    `;
}}
`;
const Bottom = styled.div `
  ${({ themes }) => {
    const { spacingByChar, border } = themes;
    return css `
      display: flex;
      justify-content: flex-end;
      padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
      border-top: ${border.shorthand};
    `;
}}
`;
//# sourceMappingURL=MessageDialogContentInner.js.map