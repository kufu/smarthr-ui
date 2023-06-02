import React, { useCallback, useContext } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { getIsInclude, mapToKeyArray } from '../../libs/map';
import { Heading } from '../Heading';
import { FaCaretRightIcon, FaCaretUpIcon } from '../Icon';
import { AccordionPanelContext } from './AccordionPanel';
import { AccordionPanelItemContext } from './AccordionPanelItem';
import { getNewExpandedItems } from './accordionPanelHelper';
import { useClassNames } from './useClassNames';
export const AccordionPanelTrigger = ({ children, className = '', headingType = 'blockTitle', headingTag, ...props }) => {
    const theme = useTheme();
    const { name } = useContext(AccordionPanelItemContext);
    const { iconPosition, displayIcon, expandedItems, onClickTrigger, onClickProps, expandableMultiply, } = useContext(AccordionPanelContext);
    const classNames = useClassNames();
    const isExpanded = getIsInclude(expandedItems, name);
    const buttonClassNames = `${className} ${classNames.trigger}`;
    const handleClick = useCallback(() => {
        if (onClickTrigger)
            onClickTrigger(name, !isExpanded);
        if (onClickProps) {
            const newExpandedItems = getNewExpandedItems(expandedItems, name, !isExpanded, expandableMultiply);
            onClickProps(mapToKeyArray(newExpandedItems));
        }
    }, [onClickTrigger, name, isExpanded, onClickProps, expandedItems, expandableMultiply]);
    return (React.createElement(Heading, { tag: headingTag, type: headingType },
        React.createElement(Button, { ...props, id: `${name}-trigger`, className: buttonClassNames, "aria-expanded": isExpanded, "aria-controls": `${name}-content`, themes: theme, onClick: handleClick, type: "button", "data-component": "AccordionHeaderButton" },
            displayIcon && iconPosition === 'left' && React.createElement(LeftIcon, null),
            React.createElement(TriggerTitle, null, children),
            displayIcon && iconPosition === 'right' && React.createElement(RightIcon, null))));
};
const TriggerTitle = styled.span `
  flex-grow: 1;
`;
const resetButtonStyle = css `
  background-color: transparent;
  border: none;
  padding: 0;
  appearance: none;
`;
const Button = styled.button `
  ${resetButtonStyle}
  ${({ themes }) => {
    const { color, spacingByChar, shadow } = themes;
    return css `
      display: flex;
      align-items: center;
      width: 100%;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      cursor: pointer;
      font-size: inherit;
      text-align: left;

      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
        box-shadow: none;
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }

      /* TODO replace if impremented Layout component */
      & > * + * {
        margin-left: ${spacingByChar(0.5)};
      }
    `;
}}
`;
const LeftIcon = styled(FaCaretRightIcon) `
  transition: transform 0.3s;

  [aria-expanded='true'] > & {
    transform: rotate(90deg);
  }
`;
const RightIcon = styled(FaCaretUpIcon) `
  transition: transform 0.3s;

  [aria-expanded='true'] & {
    transform: rotate(-180deg);
  }
`;
//# sourceMappingURL=AccordionPanelTrigger.js.map