import React, { ComponentType, ReactNode, VFC } from 'react';
import { ComponentProps as IconProps } from '../Icon';
export type AppNaviCustomTagProps = {
    /** ボタンのテキスト */
    children: ReactNode;
    /** このボタンのカスタムタグ */
    tag: ComponentType<any>;
    /** 表示するアイコンタイプ */
    icon?: React.ComponentType<IconProps>;
    /** アクティブ状態であるかどうか */
    current?: boolean;
} & {
    [key: string]: any;
};
type InnerProps = AppNaviCustomTagProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviCustomTag: VFC<InnerProps>;
export {};
