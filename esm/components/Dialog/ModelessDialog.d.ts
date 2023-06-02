import { FC, MouseEvent, ReactNode, RefObject } from 'react';
import { DecoratorsType } from '../../types/props';
import { BaseElementProps } from '../Base';
type Props = {
    /**
     * ダイアログのヘッダ部分の内容
     */
    header: ReactNode;
    /**
     * ダイアログのコンテンツ部分の内容
     */
    children: ReactNode;
    /**
     * ダイアログのフッタ部分の内容
     */
    footer?: ReactNode;
    /**
     * ダイアログが開かれているかどうかの真偽値
     */
    isOpen: boolean;
    /**
     * 閉じるボタンを押下したときのハンドラ
     */
    onClickClose?: (e: MouseEvent<HTMLButtonElement>) => void;
    /**
     * ダイアログが開いている状態で Escape キーを押下したときのハンドラ
     */
    onPressEscape?: () => void;
    /**
     * ダイアログの幅
     */
    width?: string | number;
    /**
     * ダイアログの高さ
     */
    height?: string | number;
    /**
     * ダイアログを開いたときの初期 top 位置
     */
    top?: string | number;
    /**
     * ダイアログを開いたときの初期 left 位置
     */
    left?: string | number;
    /**
     * ダイアログを開いたときの初期 right 位置
     */
    right?: string | number;
    /**
     * ダイアログを開いたときの初期 bottom 位置
     */
    bottom?: string | number;
    /**
     * ポータルの container となる DOM 要素を追加する親要素
     */
    portalParent?: HTMLElement | RefObject<HTMLElement>;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'closeButtonIconAlt'> & {
        dialogHandlerAriaLabel?: (txt: string) => string;
        dialogHandlerAriaValuetext?: (txt: string, data: DOMRect | undefined) => string;
    };
};
export declare const ModelessDialog: FC<Props & BaseElementProps>;
export {};
