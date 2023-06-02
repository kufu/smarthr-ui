import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../Heading';
import { Center, Stack } from '../Layout';
import { SmartHRLogo } from '../SmartHRLogo';
import { TextLink } from '../TextLink';
import { useClassNames } from './useClassNames';
export const MessageScreen = ({ logo = React.createElement(SmartHRLogo, { fill: "brand" }), title, links, children, footer, className = '', ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    return (React.createElement(Wrapper, { ...props, themes: theme, className: `${className} ${classNames.wrapper}` },
        React.createElement(Box, null,
            React.createElement(Logo, { className: classNames.logo }, logo),
            React.createElement(Stack, { align: "center" },
                title && React.createElement(Heading, { className: classNames.title }, title),
                children && React.createElement(Content, { className: classNames.content }, children),
                links?.length && (React.createElement(Links, { className: classNames.linkList }, links.map((link, index) => (React.createElement("li", { key: index },
                    React.createElement(TextLink, { ...(link.target ? { target: link.target } : {}), href: link.url, className: classNames.link }, link.label)))))))),
        footer && React.createElement(FooterArea, { className: classNames.footer }, footer)));
};
const Wrapper = styled(Center).attrs({ minHeight: '100vh', verticalCentering: true }) `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      background-color: ${color.BACKGROUND};
    `;
}}
`;
const Box = styled(Stack).attrs({ gap: 1.5, align: 'center' }) `
  margin-block: auto;
`;
const Logo = styled.div ``;
const Content = styled.div ``;
const Links = styled(Stack).attrs({ as: 'ul', gap: 0.5, align: 'center' }) ``;
const FooterArea = styled.div `
  align-self: stretch;
`;
//# sourceMappingURL=MessageScreen.js.map