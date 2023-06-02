import React, { ReactNode, VFC } from 'react';
import { ComponentProps as IconProps } from '../Icon';
export type AppNaviDropdownProps = {
    /** ボタンのテキスト */
    children: ReactNode;
    /** ドロップダウンのコンテンツ */
    dropdownContent: ReactNode;
    /** 表示するアイコンタイプ */
    icon?: React.ComponentType<IconProps>;
    /** アクティブ状態であるかどうか */
    current?: boolean;
};
type InnerProps = AppNaviDropdownProps & {
    isUnclickable?: boolean;
    displayCaret?: boolean;
};
export declare const AppNaviDropdown: VFC<InnerProps>;
export {};
