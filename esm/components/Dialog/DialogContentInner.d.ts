import { HTMLAttributes, ReactNode, RefObject, VFC } from 'react';
export type DialogContentInnerProps = {
    /**
     * オーバーレイをクリックした時に発火するコールバック関数
     */
    onClickOverlay?: () => void;
    /**
     * エスケープキーを押下した時に発火するコールバック関数
     */
    onPressEscape?: () => void;
    /**
     * ダイアログを開いているかどうか
     */
    isOpen: boolean;
    /**
     * ダイアログの幅
     */
    width?: string | number;
    /**
     * ダイアログを開いたときの初期 top 位置
     */
    top?: number;
    /**
     * ダイアログを開いたときの初期 right 位置
     */
    right?: number;
    /**
     * ダイアログを開いたときの初期 bottom 位置
     */
    bottom?: number;
    /**
     * ダイアログを開いたときの初期 left 位置
     */
    left?: number;
    /**
     * ダイアログの `id`
     */
    id?: string;
    /**
     * ダイアログを開いた時にフォーカスする対象
     */
    firstFocusTarget?: RefObject<HTMLElement>;
    /**
     * ダイアログの `aria-label`
     */
    ariaLabel?: string;
    /**
     * ダイアログの `aria-labelledby`
     */
    ariaLabelledby?: string;
    /**
     * コンポーネントに適用するクラス名
     */
    className?: string;
    /**
     * ダイアログの内容
     */
    children: ReactNode;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DialogContentInnerProps>;
export declare const DialogContentInner: VFC<DialogContentInnerProps & ElementProps>;
export {};
