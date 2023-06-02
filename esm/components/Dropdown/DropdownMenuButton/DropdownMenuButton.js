import React, { useMemo, } from 'react';
import innerText from 'react-innertext';
import styled, { css } from 'styled-components';
import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '..';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../Button';
import { FaCaretDownIcon, FaEllipsisHIcon } from '../../Icon';
import { Stack } from '../../Layout';
import { useClassNames } from './useClassNames';
export const DropdownMenuButton = ({ label, children, triggerSize, onlyIconTrigger = false, className = '', ...props }) => {
    const themes = useTheme();
    const classNames = useClassNames();
    const triggerLabel = useMemo(() => onlyIconTrigger ? (React.createElement(FaEllipsisHIcon, { alt: typeof label === 'string' ? label : innerText(label) })) : (label), [onlyIconTrigger, label]);
    const triggerSuffix = useMemo(
    // eslint-disable-next-line react/jsx-no-useless-fragment
    () => (onlyIconTrigger ? React.createElement(React.Fragment, null) : React.createElement(FaCaretDownIcon, { alt: "\u5019\u88DC\u3092\u958B\u304F" })), [onlyIconTrigger]);
    return (React.createElement(Dropdown, null,
        React.createElement(DropdownTrigger, { className: `${classNames.wrapper}${className && ` ${className}`}` },
            React.createElement(TriggerButton, { ...props, suffix: triggerSuffix, size: triggerSize, square: onlyIconTrigger, className: classNames.trigger }, triggerLabel)),
        React.createElement(DropdownContent, null,
            React.createElement(DropdownScrollArea, null,
                React.createElement(ActionList, { themes: themes, className: classNames.panel }, React.Children.map(children, (item, i) => 
                // MEMO: {flag && <Button/>}のような書き方に対応させる為、型を変換する
                // itemの存在チェックでfalsyな値は弾かれている想定
                item ? React.createElement("li", { key: i }, actionItem(item)) : null))))));
};
const TriggerButton = styled(Button) `
  &[aria-expanded='true'] .smarthr-ui-Icon:last-child {
    transform: rotate(0.5turn);
  }
`;
const ActionList = styled(Stack).attrs({ as: 'ul', gap: 0 }) `
  ${({ themes: { space } }) => css `
    list-style: none;
    margin-block: 0;
    padding: ${space(0.5)} ${space(0.25)};

    .smarthr-ui-Button,
    .smarthr-ui-AnchorButton {
      width: 100%;
      border-style: none;
      justify-content: flex-start;

      padding-block: ${space(0.5)};
      font-weight: normal;
    }

    .smarthr-ui-Button-disabledWrapper {
      column-gap: ${space(0.5)};
      /* unset した Button の右 padding 分 */
      padding-inline-end: ${space(1)};

      > [disabled] {
        padding-inline-end: unset;
        width: unset;
      }
    }
  `}
`;
const actionItem = (item) => React.cloneElement(item, { variant: 'text', wide: true });
//# sourceMappingURL=DropdownMenuButton.js.map