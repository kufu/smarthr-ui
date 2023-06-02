import React, { useEffect, } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Base as BaseComponent } from '../Base';
import { Cluster, Stack } from '../Layout';
import { TertiaryLink } from './TertiaryLink';
import { validateElement } from './bottomFixedAreaHelper';
import { useClassNames } from './useClassNames';
export const BottomFixedArea = ({ description, primaryButton, secondaryButton, tertiaryLinks, zIndex = 500, className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    useEffect(() => {
        validateElement(primaryButton, secondaryButton);
    }, [primaryButton, secondaryButton]);
    return (React.createElement(Base, { ...props, themes: theme, zIndex: zIndex, className: `${className} ${classNames.wrapper}` },
        React.createElement(Stack, null,
            description && React.createElement(Text, { className: classNames.description }, description),
            (secondaryButton || primaryButton) && (React.createElement(ListCluster, { justify: "center", gap: { row: 0.5, column: 1 } },
                secondaryButton && React.createElement("li", { className: classNames.secondaryButton }, secondaryButton),
                primaryButton && React.createElement("li", { className: classNames.primaryButton }, primaryButton))),
            tertiaryLinks && tertiaryLinks.length > 0 && (React.createElement(ListCluster, { justify: "center", gap: { row: 0.5, column: 1 } }, tertiaryLinks.map((tertiaryLink, index) => (React.createElement("li", { key: index, className: classNames.tertiaryListItem },
                React.createElement(TertiaryLink, { ...tertiaryLink })))))))));
};
const Base = styled(BaseComponent) `
  ${({ themes: { spacingByChar }, zIndex }) => {
    return css `
      position: fixed;
      bottom: 0;
      width: 100%;
      padding: ${spacingByChar(1.5)};
      text-align: center;
      z-index: ${zIndex};
      box-shadow: 0 -4px 8px 2px rgba(0, 0, 0, 0.24);
      border-radius: 0;
      box-sizing: border-box;
    `;
}}
`;
const Text = styled.div `
  margin: 0;
`;
const ListCluster = styled(Cluster).attrs({
    as: 'ul',
}) `
  list-style: none;
  margin: 0;
  padding: 0;
`;
//# sourceMappingURL=BottomFixedArea.js.map