import React, { ReactNode, VFC } from 'react';
import { ComponentProps as IconProps } from '../Icon';
export type AppNaviAnchorProps = {
    /** アンカーのテキスト */
    children: ReactNode;
    /** アンカーの href */
    href: string;
    /** 表示するアイコンタイプ */
    icon?: React.ComponentType<IconProps>;
    /** アクティブ状態であるかどうか */
    current?: boolean;
};
type InnerProps = AppNaviAnchorProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviAnchor: VFC<InnerProps>;
export {};
