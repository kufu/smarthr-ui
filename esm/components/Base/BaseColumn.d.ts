import React, { ComponentProps, HTMLAttributes } from 'react';
import { Theme } from '../../hooks/useTheme';
import { GreyScaleColors } from '../../themes/createColor';
type BaseProps = Omit<ComponentProps<typeof Base>, 'radius' | 'layer'>;
type Props = {
    /** 背景色。初期値は COLUMN */
    bgColor?: GreyScaleColors;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof BaseProps | keyof Props>;
export declare const BaseColumn: React.FC<BaseProps & Props & ElementProps>;
declare const Base: import("styled-components").StyledComponent<React.ForwardRefExoticComponent<{
    padding?: import("../Layout").Gap | {
        block?: import("../Layout").Gap | undefined;
        inline?: import("../Layout").Gap | undefined;
    } | undefined;
    radius?: "s" | "m" | undefined;
    overflow?: import("csstype").Property.Overflow | {
        x: import("csstype").Property.OverflowX | undefined;
        y: import("csstype").Property.OverflowY | undefined;
    } | undefined;
    layer?: 0 | 2 | 1 | 3 | 4 | undefined;
} & {
    children?: React.ReactNode;
} & import("./Base").ElementProps & React.RefAttributes<HTMLDivElement>>, any, {
    bgColor?: Props['bgColor'];
    themes: Theme;
}, never>;
export {};
