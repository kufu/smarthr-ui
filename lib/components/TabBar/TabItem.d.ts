import { ButtonHTMLAttributes, ReactNode, VFC } from 'react';
type Props = {
    /** タブの ID */
    id: string;
    /** タブの内容 */
    children: ReactNode;
    /** `true` のとき、タブが選択状態のスタイルになる */
    selected?: boolean;
    /** `true` のとき、タブを無効状態にしてクリック不能にする */
    disabled?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** タブをクリックした時に発火するコールバック関数 */
    onClick: (tabId: string) => void;
};
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props | 'role' | 'aria-selected' | 'type'>;
export declare const TabItem: VFC<Props & ElementProps>;
export {};
