import { HTMLAttributes, ReactNode, VFC } from 'react';
import { AppNaviAnchorProps } from './AppNaviAnchor';
import { AppNaviButtonProps } from './AppNaviButton';
import { AppNaviCustomTagProps } from './AppNaviCustomTag';
import { AppNaviDropdownProps } from './AppNaviDropdown';
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
type Props = {
    /** ラベルのテキスト */
    label?: ReactNode;
    /** 表示するボタンの Props の配列 */
    buttons?: Array<AppNaviButtonProps | AppNaviAnchorProps | AppNaviDropdownProps | AppNaviCustomTagProps>;
    /** アクティブ状態のボタンがクリック可能かどうか */
    isCurrentUnclickable?: boolean;
    /** 追加で表示する内容 */
    children?: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** ドロップダウンにキャレットを表示するかどうか */
    displayDropdownCaret?: boolean;
};
export declare const AppNavi: VFC<Props & ElementProps>;
export {};
