import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../../hooks/useTheme';
import { Button } from '../../Button';
import { Dropdown, DropdownContent, DropdownScrollArea, DropdownTrigger } from '../../Dropdown';
import { Heading } from '../../Heading';
import { FaToolboxIcon } from '../../Icon';
import { Cluster, Stack } from '../../Layout';
import { TextLink } from '../../TextLink';
import { useClassNames } from './useClassNames';
const TRIGGER_LABEL = 'アプリ';
export const AppLauncher = ({ apps, urlToShowAll, decorators, ...props }) => {
    const theme = useTheme();
    const classNames = useClassNames();
    const triggerLabel = useMemo(() => decorators?.triggerLabel?.(TRIGGER_LABEL) || TRIGGER_LABEL, [decorators]);
    const baseApps = apps.find(({ type }) => type === 'base');
    const others = apps.filter((category) => category !== baseApps);
    return (React.createElement(Dropdown, { ...props },
        React.createElement(DropdownTrigger, null,
            React.createElement(AppsButton, { themes: theme, prefix: React.createElement(FaToolboxIcon, null) }, triggerLabel)),
        React.createElement(DropdownContent, { controllable: true },
            React.createElement(Wrapper, { themes: theme, className: classNames.wrapper },
                React.createElement(DropdownScrollArea, null,
                    React.createElement(Stack, { gap: 1.5 },
                        baseApps && (React.createElement(Stack, { gap: 0.5, className: classNames.category },
                            React.createElement(Heading, { type: "subSubBlockTitle", tag: "h3" }, baseApps.heading),
                            React.createElement(Cluster, { as: "ul", gap: 1 }, baseApps.items.map((item, index) => (React.createElement("li", { key: index },
                                React.createElement(TextLink, { href: item.url, target: item.target, className: classNames.link }, item.label))))))),
                        React.createElement(Cluster, { gap: 1.5 }, others.map(({ heading, items }, i) => (React.createElement(Stack, { gap: 0.5, className: classNames.category, key: i, recursive: true },
                            React.createElement(Heading, { type: "subSubBlockTitle", tag: "h3" }, heading),
                            React.createElement("ul", null, items.map((item, index) => (React.createElement("li", { key: index },
                                React.createElement(TextLink, { href: item.url, target: item.target, className: classNames.link }, item.label))))))))))),
                urlToShowAll && (React.createElement(Footer, { themes: theme, className: classNames.footer },
                    React.createElement(TextLink, { href: urlToShowAll, style: { width: 'fit-content' } }, "\u3059\u3079\u3066\u898B\u308B")))))));
};
const AppsButton = styled(Button) `
  ${({ themes: { color, space } }) => css `
    border-color: transparent;
    background-color: transparent;
    padding-inline: ${space(0.25)};
    color: ${color.TEXT_WHITE};
    font-weight: normal;

    &:hover,
    &:focus-visible {
      border-color: transparent;
      background-color: transparent;
    }
  `}
`;
const Wrapper = styled(Stack).attrs({ as: 'nav', gap: 1.5 }) `
  ${({ themes: { space, leading } }) => css `
    padding: ${space(1.5)};
    line-height: ${leading.NORMAL};
  `}
`;
const Footer = styled(Stack) `
  ${({ themes: { border, space } }) => css `
    &&& {
      margin-block-end: ${space(-0.25)};
    }
    margin-inline: ${space(-0.75)};
    border-top: ${border.shorthand};
    padding-block-start: ${space(1)};
    padding-inline: ${space(0.75)};
  `}
`;
//# sourceMappingURL=AppLauncher.js.map