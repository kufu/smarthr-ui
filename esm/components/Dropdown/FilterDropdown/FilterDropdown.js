import React, { useMemo } from 'react';
import innerText from 'react-innertext';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../Button';
import { FaCheckCircleIcon, FaExclamationCircleIcon, FaFilterIcon, FaUndoAltIcon } from '../../Icon';
import { Cluster, Stack } from '../../Layout';
import { Dropdown } from '../Dropdown';
import { DropdownCloser } from '../DropdownCloser';
import { DropdownContent } from '../DropdownContent';
import { DropdownScrollArea } from '../DropdownScrollArea';
import { DropdownTrigger } from '../DropdownTrigger';
const STATUS_FILTERED_TEXT = '適用中';
const TRIGGER_BUTTON_TEXT = '絞り込み';
const APPLY_BUTTON_TEXT = '適用';
const CANCEL_BUTTON_TEXT = 'キャンセル';
const RESET_BUTTON_TEXT = '絞り込み条件を解除';
const executeDecorator = (defaultText, decorator) => decorator?.(defaultText) || defaultText;
export const FilterDropdown = ({ isFiltered = false, onApply, onCancel, onReset, children, hasStatusText, decorators, responseMessage, ...props }) => {
    const themes = useTheme();
    const status = useMemo(() => executeDecorator(STATUS_FILTERED_TEXT, decorators?.status), [decorators]);
    const triggerButton = useMemo(() => executeDecorator(TRIGGER_BUTTON_TEXT, decorators?.triggerButton), [decorators]);
    const applyButton = useMemo(() => executeDecorator(APPLY_BUTTON_TEXT, decorators?.applyButton), [decorators]);
    const cancelButton = useMemo(() => executeDecorator(CANCEL_BUTTON_TEXT, decorators?.cancelButton), [decorators]);
    const resetButton = useMemo(() => executeDecorator(RESET_BUTTON_TEXT, decorators?.resetButton), [decorators]);
    const filteredIconAriaLabel = useMemo(() => (hasStatusText ? undefined : innerText(status)), [status, hasStatusText]);
    const isRequestProcessing = responseMessage !== undefined && responseMessage.status === 'processing';
    return (React.createElement(Dropdown, null,
        React.createElement(DropdownTrigger, null,
            React.createElement(Button, { ...props, suffix: React.createElement(IsFilteredIconWrapper, { isFiltered: isFiltered, themes: themes },
                    React.createElement(FaFilterIcon, null),
                    isFiltered ? (React.createElement(FaCheckCircleIcon, { size: 8, "aria-label": filteredIconAriaLabel })) : null) }, triggerButton)),
        hasStatusText && isFiltered ? React.createElement(StatusText, { themes: themes }, status) : null,
        React.createElement(DropdownContent, { controllable: true },
            React.createElement(DropdownScrollArea, null,
                React.createElement(ContentLayout, { themes: themes }, children)),
            React.createElement(ActionArea, { themes: themes },
                React.createElement(Cluster, { gap: 1, align: "center", justify: "space-between" },
                    onReset && (React.createElement(ResetButtonLayout, { themes: themes },
                        React.createElement(Button, { variant: "text", size: "s", prefix: React.createElement(FaUndoAltIcon, null), onClick: onReset, disabled: isRequestProcessing }, resetButton))),
                    React.createElement(RightButtonLayout, null,
                        React.createElement(DropdownCloser, null,
                            React.createElement(Button, { onClick: onCancel, disabled: isRequestProcessing }, cancelButton)),
                        React.createElement(DropdownCloser, null,
                            React.createElement(Button, { variant: "primary", onClick: onApply, loading: isRequestProcessing }, applyButton)))),
                responseMessage?.status === 'success' && (React.createElement(Message, null,
                    React.createElement(FaCheckCircleIcon, { color: themes.color.MAIN, text: responseMessage.text, role: "alert" }))),
                responseMessage?.status === 'error' && (React.createElement(Message, null,
                    React.createElement(FaExclamationCircleIcon, { color: themes.color.DANGER, text: responseMessage.text, role: "alert" })))))));
};
const IsFilteredIconWrapper = styled.span `
  position: relative;
  color: ${({ isFiltered, themes }) => {
    return isFiltered ? themes.color.MAIN : themes.color.TEXT_BLACK;
}};
  line-height: 1;

  & > [role='img'] + [role='img'] {
    position: absolute;
    right: -4px;
    bottom: 2px;
  }
`;
const StatusText = styled.span `
  margin-left: ${({ themes }) => themes.spacing.XXS};
  font-size: ${({ themes }) => themes.fontSize.S};
`;
const ContentLayout = styled.div `
  ${({ themes: { space } }) => css `
    padding: ${space(1.5)};
  `}
`;
const ActionArea = styled(Stack).attrs({ gap: 0.5 }) `
  ${({ themes: { space, border } }) => css `
    border-block-start: ${border.shorthand};
    padding: ${space(1)} ${space(1.5)};
  `}
`;
const ResetButtonLayout = styled.div `
  ${({ themes: { space } }) => css `
    margin-inline-start: ${space(-0.5)};
  `}
`;
const RightButtonLayout = styled(Cluster).attrs({
    gap: { column: 1, row: 0.5 },
    justify: 'flex-end',
}) `
  margin-inline-start: auto;
`;
const Message = styled.div `
  text-align: right;
`;
//# sourceMappingURL=FilterDropdown.js.map