import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
export const Footer = ({ className = '', ...props }) => {
    const theme = useTheme();
    const { footer } = useClassNames();
    return (React.createElement(Wrapper, { ...props, themes: theme, className: `${footer} ${className}` },
        React.createElement(List, { themes: theme },
            React.createElement(Item, { href: "https://support.smarthr.jp/" }, "\u30D8\u30EB\u30D7"),
            React.createElement(Item, { href: "https://smarthr.jp/update/" }, "\u304A\u77E5\u3089\u305B"),
            React.createElement(Item, { href: "https://smarthr.jp/terms/" }, "\u5229\u7528\u898F\u7D04"),
            React.createElement(Item, { href: "https://smarthr.co.jp/privacy/" }, "\u30D7\u30E9\u30A4\u30D0\u30B7\u30FC\u30DD\u30EA\u30B7\u30FC"),
            React.createElement(Item, { href: "https://smarthr.co.jp" }, "\u904B\u55B6\u4F1A\u793E"),
            React.createElement(Item, { href: "https://developer.smarthr.jp" }, "\u958B\u767A\u8005\u5411\u3051API ")),
        React.createElement(Copy, { themes: theme }, "\u00A9 SmartHR, Inc.")));
};
const Wrapper = styled.footer `
  ${({ themes: { color, fontSize, spacingByChar } }) => css `
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: ${spacingByChar(1)} ${spacingByChar(1.5)};
    background-color: ${color.BRAND};
    color: ${color.TEXT_WHITE};
    font-size: ${fontSize.M};
  `}
`;
const List = styled.ul `
  ${({ themes: { spacingByChar } }) => css `
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;

    > li {
      padding: 3px 0;
      margin-right: ${spacingByChar(0.5)};
    }
  `}
`;
const Item = ({ children, href, className = '' }) => {
    const theme = useTheme();
    return (React.createElement("li", { className: className },
        React.createElement(ItemAnchor, { themes: theme, target: "_blank", rel: "noopener noreferrer", href: href }, children)));
};
const ItemAnchor = styled.a `
  color: ${({ themes }) => themes.color.TEXT_WHITE};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
const Copy = styled.small `
  ${({ themes }) => css `
    margin-left: auto;
    font-size: ${themes.fontSize.M};
  `}
`;
//# sourceMappingURL=Footer.js.map