import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../Button';
import { FaCheckCircleIcon, FaExclamationCircleIcon } from '../../Icon';
import { Cluster, Stack } from '../../Layout';
import { Text } from '../../Text';
import { useOffsetHeight } from '../dialogHelper';
import { useClassNames } from '../useClassNames';
const CLOSE_BUTTON_LABEL = 'キャンセル';
export const ActionDialogContentInner = ({ children, title, titleId, subtitle, titleTag = 'h2', actionText, actionTheme = 'primary', onClickAction, onClickClose, responseMessage, actionDisabled = false, closeDisabled, decorators, }) => {
    const classNames = useClassNames().dialog;
    const theme = useTheme();
    const handleClickAction = useCallback(() => {
        onClickAction(onClickClose);
    }, [onClickAction, onClickClose]);
    const { offsetHeight, titleRef, bottomRef } = useOffsetHeight();
    const isRequestProcessing = responseMessage && responseMessage.status === 'processing';
    return (React.createElement(React.Fragment, null,
        React.createElement(TitleArea, { gap: 0.25, themes: theme, ref: titleRef, className: classNames.titleArea, as: titleTag },
            subtitle && (React.createElement(Text, { size: "S", leading: "TIGHT", color: "TEXT_GREY", className: classNames.subtitle }, subtitle)),
            React.createElement(Text, { id: titleId, size: "L", leading: "TIGHT", className: classNames.title }, title)),
        React.createElement(Body, { offsetHeight: offsetHeight, className: classNames.body }, children),
        React.createElement(ActionArea, { themes: theme, ref: bottomRef, className: classNames.actionArea },
            React.createElement(ButtonArea, { className: classNames.buttonArea },
                React.createElement(Button, { onClick: onClickClose, disabled: closeDisabled || isRequestProcessing, className: classNames.closeButton }, decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL),
                React.createElement(Button, { variant: actionTheme, onClick: handleClickAction, disabled: actionDisabled, loading: isRequestProcessing, className: classNames.actionButton }, actionText)),
            responseMessage && (React.createElement(React.Fragment, null,
                responseMessage.status === 'success' && (React.createElement(Message, null,
                    React.createElement(FaCheckCircleIcon, { color: theme.color.MAIN, text: responseMessage.text, role: "alert" }))),
                responseMessage.status === 'error' && (React.createElement(Message, null,
                    React.createElement(FaExclamationCircleIcon, { color: theme.color.DANGER, text: responseMessage.text, role: "alert" }))))))));
};
const TitleArea = styled(Stack) `
  ${({ themes: { border, space } }) => css `
    margin-block: unset;
    border-bottom: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`;
const Body = styled.div `
  ${({ offsetHeight }) => css `
    max-height: calc(100vh - ${offsetHeight}px);
    overflow: auto;
  `}
`;
const ActionArea = styled(Stack).attrs({ gap: 0.5 }) `
  ${({ themes: { space, border } }) => css `
    border-top: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`;
const ButtonArea = styled(Cluster).attrs({ gap: { row: 0.5, column: 1 }, justify: 'flex-end' }) ``;
const Message = styled.div `
  text-align: right;
`;
//# sourceMappingURL=ActionDialogContentInner.js.map