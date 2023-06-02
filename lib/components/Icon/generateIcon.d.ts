import React from 'react';
import { IconBaseProps, IconType } from 'react-icons';
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing';
/**
 * literal union type に補完を効かせるためのハック
 * https://github.com/microsoft/TypeScript/issues/29729
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
export declare const generateIcon: (svg: IconType) => React.FC<ComponentProps>;
declare const definedColors: readonly ["TEXT_BLACK", "TEXT_WHITE", "TEXT_GREY", "TEXT_DISABLED", "TEXT_LINK", "MAIN", "DANGER", "WARNING", "BRAND"];
type DefinedColor = (typeof definedColors)[number];
interface IconProps {
    /**
     * アイコンの色
     * @type string | 'TEXT_BLACK' | 'TEXT_GREY' | 'TEXT_DISABLED' | 'TEXT_LINK' | 'MAIN' | 'DANGER' | 'WARNING' | 'BRAND'
     */
    color?: LiteralUnion<DefinedColor>;
    /**
     * アイコンの大きさ
     * @deprecated 親要素やデフォルトフォントサイズが継承されるため固定値の指定は非推奨
     */
    size?: IconBaseProps['size'];
}
type ElementProps = Omit<React.SVGAttributes<SVGAElement>, keyof IconProps>;
export interface ComponentProps extends IconProps, ElementProps {
    /**アイコンの説明テキスト*/
    alt?: React.ReactNode;
    /** アイコンと並べるテキスト */
    text?: React.ReactNode;
    /** アイコンと並べるテキストとの溝 */
    iconGap?: CharRelativeSize | AbstractSize;
    /** `true` のとき、アイコンを右側に表示する */
    right?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
}
export declare const createIcon: (SvgIcon: IconType) => React.FC<ComponentProps>;
export {};
