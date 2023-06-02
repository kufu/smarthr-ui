import React, { forwardRef, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useSpacing } from '../../hooks/useSpacing';
import { useTheme } from '../../hooks/useTheme';
import { useClassNames } from './useClassNames';
export const layerMap = {
    0: 'LAYER0',
    1: 'LAYER1',
    2: 'LAYER2',
    3: 'LAYER3',
    4: 'LAYER4',
};
const separatePadding = (padding) => {
    if (padding instanceof Object) {
        return {
            block: padding.block,
            inline: padding.inline,
        };
    }
    return {
        block: padding,
        inline: padding,
    };
};
export const Base = forwardRef(({ padding, radius = 'm', overflow, layer = 1, className = '', ...props }, ref) => {
    const themes = useTheme();
    const classNames = useClassNames();
    const $padding = separatePadding(padding);
    const $radius = useMemo(() => {
        switch (radius) {
            case 's':
                return themes.radius.m;
            case 'm':
                return themes.radius.l;
        }
    }, [radius, themes.radius.l, themes.radius.m]);
    return (React.createElement(Wrapper, { ...props, className: `${className} ${classNames.base.wrapper}`, themes: themes, "$padding": $padding, "$radius": $radius, "$overflow": overflow, "$layer": layerMap[layer], ref: ref }));
});
const Wrapper = styled.div `
  ${({ themes: { border, color, shadow }, $padding, $radius, $overflow, $layer }) => css `
    box-shadow: ${shadow[$layer]};
    border-radius: ${$radius};
    background-color: ${color.WHITE};
    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    ${$padding.block && `padding-block: ${useSpacing($padding.block)};`}
    ${$padding.inline && `padding-inline: ${useSpacing($padding.inline)};`}
    ${$overflow &&
    ($overflow instanceof Object
        ? css `
          overflow-x: ${$overflow.x};
          overflow-y: ${$overflow.y};
        `
        : css `
          overflow: ${$overflow};
        `)}
  `}
`;
//# sourceMappingURL=Base.js.map