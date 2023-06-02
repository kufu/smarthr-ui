import React, { ReactNode, VFC } from 'react';
import { ComponentProps as IconProps } from '../Icon';
export type AppNaviButtonProps = {
    /** ボタンのテキスト */
    children: ReactNode;
    /** 表示するアイコンタイプ */
    icon?: React.ComponentType<IconProps>;
    /** アクティブ状態であるかどうか */
    current?: boolean;
    /** クリックイベントのハンドラ */
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
type InnerProps = AppNaviButtonProps & {
    isUnclickable?: boolean;
};
export declare const AppNaviButton: VFC<InnerProps>;
export {};
