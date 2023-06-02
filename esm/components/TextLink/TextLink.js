import React, { forwardRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../hooks/useTheme';
import { FaExternalLinkAltIcon } from '../Icon';
export const TextLink = forwardRef(({ href, target, onClick, children, prefix, suffix, ...props }, ref) => {
    const theme = useTheme();
    const actualSuffix = useMemo(() => {
        if (target === '_blank' && suffix === undefined) {
            return React.createElement(FaExternalLinkAltIcon, { "aria-label": "\u5225\u30BF\u30D6\u3067\u958B\u304F" });
        }
        return suffix;
    }, [suffix, target]);
    const actualHref = useMemo(() => {
        if (href) {
            return href;
        }
        if (onClick) {
            return '';
        }
        return undefined;
    }, [href, onClick]);
    const actualOnClick = useMemo(() => {
        if (!onClick) {
            return undefined;
        }
        return (e) => {
            if (!href) {
                e.preventDefault();
            }
            onClick(e);
        };
    }, [href, onClick]);
    return (React.createElement(StyledAnchor, { ...props, ref: ref, href: actualHref, target: target, onClick: actualOnClick, themes: theme },
        prefix && React.createElement(PrefixWrapper, { themes: theme }, prefix),
        children,
        actualSuffix && React.createElement(SuffixWrapper, { themes: theme }, actualSuffix)));
});
const StyledAnchor = styled.a `
  ${({ themes }) => {
    const { color } = themes;
    return css `
      text-decoration: none;
      box-shadow: 0 1px 0 0;
      color: ${color.TEXT_LINK};

      &:hover {
        color: ${color.hoverColor(color.TEXT_LINK)};
      }

      &:not([href]) {
        box-shadow: none;
      }
    `;
}}
`;
const PrefixWrapper = styled.span(({ themes: { spacingByChar } }) => css `
    margin-right: ${spacingByChar(0.25)};
    vertical-align: middle;
  `);
const SuffixWrapper = styled.span(({ themes: { spacingByChar } }) => css `
    margin-left: ${spacingByChar(0.25)};
    vertical-align: middle;
  `);
//# sourceMappingURL=TextLink.js.map