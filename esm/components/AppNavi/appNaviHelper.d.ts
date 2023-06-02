import React from 'react';
import { Theme } from '../../hooks/useTheme';
import { ComponentProps as IconProps } from '../Icon';
export declare const getIconComponent: (theme: Theme, options?: {
    icon?: React.ComponentType<IconProps>;
    current?: boolean;
}) => React.JSX.Element | null;
export type ItemStyleProps = {
    themes: Theme;
    isActive?: boolean;
    isUnclickable?: boolean;
};
export declare const getItemStyle: ({ themes: { color: { hoverColor, MAIN, TEXT_BLACK, TEXT_GREY, WHITE }, fontSize, leading, spacingByChar, }, isActive, isUnclickable, }: ItemStyleProps) => import("styled-components").FlattenSimpleInterpolation;
