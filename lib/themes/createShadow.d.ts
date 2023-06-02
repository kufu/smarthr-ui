import { FlattenSimpleInterpolation } from 'styled-components';
import { ColorProperty } from './createColor';
export interface ShadowProperty {
    /**
     * @deprecated The BASE property will be deprecated, please use LAYER0~4 property instead
     */
    BASE?: string;
    /**
     * @deprecated The DIALOG property will be deprecated, please use LAYER0~4 property instead
     */
    DIALOG?: string;
    LAYER0?: string;
    LAYER1?: string;
    LAYER2?: string;
    LAYER3?: string;
    LAYER4?: string;
    OUTLINE?: string;
    OUTLINE_MARGIN?: string;
}
export interface CreatedShadowTheme {
    /**
     * @deprecated The BASE property will be deprecated, please use LAYER0~4 property instead
     */
    BASE: string;
    /**
     * @deprecated The DIALOG property will be deprecated, please use LAYER0~4 property instead
     */
    DIALOG: string;
    LAYER0?: string;
    LAYER1?: string;
    LAYER2?: string;
    LAYER3?: string;
    LAYER4?: string;
    OUTLINE: string;
    OUTLINE_MARGIN: string;
    focusIndicatorStyles: FlattenSimpleInterpolation;
}
export declare const defaultShadow: {
    BASE: string;
    DIALOG: string;
    LAYER0: string;
    LAYER1: string;
    LAYER2: string;
    LAYER3: string;
    LAYER4: string;
    OUTLINE: string;
    OUTLINE_MARGIN: string;
};
export declare const createShadow: (userShadow?: ShadowProperty, userColor?: ColorProperty) => CreatedShadowTheme;
