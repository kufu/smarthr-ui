import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useId } from '../../hooks/useId';
import { useTheme } from '../../hooks/useTheme';
import { Base } from '../Base';
import { Button } from '../Button';
import { Heading } from '../Heading';
import { FaCaretDownIcon, FaCaretUpIcon, FaCheckCircleIcon, FaExclamationCircleIcon, FaInfoCircleIcon, FaSyncAltIcon, WarningIcon, } from '../Icon';
import { Cluster, Stack } from '../Layout';
import { useClassNames } from './useClassNames';
const OPEN_BUTTON_LABEL = '開く';
const CLOSE_BUTTON_LABEL = '閉じる';
export const InformationPanel = ({ title, titleTag = 'h3', type, togglable = true, active: activeProps = true, className = '', children, onClickTrigger, decorators, ...props }) => {
    const theme = useTheme();
    const { Icon, iconColor } = useMemo(() => {
        switch (type) {
            case 'success':
                return {
                    Icon: SuccessTitleIcon,
                    iconColor: theme.color.MAIN,
                };
            case 'info':
            default:
                return {
                    Icon: InfoTitleIcon,
                    iconColor: theme.color.TEXT_GREY,
                };
            case 'warning':
                return {
                    Icon: WarningTitleIcon,
                    iconColor: theme.color.WARNING,
                };
            case 'error':
                return {
                    Icon: ErrorTitleIcon,
                    iconColor: theme.color.DANGER,
                };
            case 'sync':
                return {
                    Icon: SyncIcon,
                    iconColor: theme.color.MAIN,
                };
        }
    }, [type, theme.color.DANGER, theme.color.MAIN, theme.color.TEXT_GREY, theme.color.WARNING]);
    const [active, setActive] = useState(activeProps);
    const titleId = useId();
    const contentId = useId();
    const handleClickTrigger = useCallback(() => {
        if (onClickTrigger) {
            onClickTrigger(active);
        }
        else {
            setActive(!active);
        }
    }, [active, onClickTrigger]);
    useEffect(() => {
        setActive(activeProps);
    }, [activeProps]);
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.wrapper}`, themes: theme, role: "region", "aria-labelledby": titleId },
        React.createElement(Stack, { gap: 1.25 },
            React.createElement(Header, { themes: theme, togglable: togglable },
                React.createElement(Heading, { type: "blockTitle", tag: titleTag, id: titleId, className: classNames.title },
                    React.createElement(Icon, { color: iconColor, text: title, iconGap: 0.5 })),
                togglable && (React.createElement(TogglableButton, { suffix: active ? React.createElement(FaCaretUpIcon, null) : React.createElement(FaCaretDownIcon, null), size: "s", onClick: handleClickTrigger, "aria-expanded": togglable ? active : undefined, "aria-controls": contentId, className: classNames.closeButton }, active
                    ? decorators?.closeButtonLabel?.(CLOSE_BUTTON_LABEL) || CLOSE_BUTTON_LABEL
                    : decorators?.openButtonLabel?.(OPEN_BUTTON_LABEL) || OPEN_BUTTON_LABEL))),
            React.createElement(Content, { themes: theme, id: contentId, "aria-hidden": !active, className: classNames.content }, children))));
};
const Wrapper = styled(Base) `
  ${({ themes: { spacingByChar, shadow } }) => css `
    padding: ${spacingByChar(1.5)};
    box-shadow: ${shadow.LAYER3};
  `}
`;
const Header = styled(Cluster).attrs({
    align: 'center',
    justify: 'space-between',
}) `
  ${({ themes: { border, fontSize, leading, space }, togglable }) => {
    // (Button(1rem + padding-block + border) - Heading(1rem * 1.25) / 2)
    const adjust = `calc((
        (${fontSize.S} + ${space(1)} + ${border.lineWidth} * 2)
        - (${fontSize.M} * ${leading.TIGHT})
      ) / -2)
    `;
    return css `
      ${togglable &&
        css `
        &&& {
          margin-block: ${adjust};
        }
      `}
    `;
}}
`;
const TogglableButton = styled(Button) `
  margin-inline-start: auto;
`;
const createTitleIcon = (Icon) => styled(Icon) `
  flex-shrink: 0;
`;
const SuccessTitleIcon = createTitleIcon(FaCheckCircleIcon);
const InfoTitleIcon = createTitleIcon(FaInfoCircleIcon);
const WarningTitleIcon = createTitleIcon(WarningIcon);
const ErrorTitleIcon = createTitleIcon(FaExclamationCircleIcon);
const SyncIcon = createTitleIcon(FaSyncAltIcon);
const Content = styled.div `
  ${({ themes: { fontSize } }) => css `
    font-size: ${fontSize.M};

    &[aria-hidden='true'] {
      display: none;
    }
  `}
`;
//# sourceMappingURL=InformationPanel.js.map