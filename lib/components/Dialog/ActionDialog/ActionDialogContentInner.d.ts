import { FC, ReactNode } from 'react';
import { DecoratorsType, ResponseMessageType } from '../../../types/props';
import { HeadingTagTypes } from '../../Heading';
export type BaseProps = {
    /**
     * ダイアログの内容
     */
    children: ReactNode;
    /**
     * ダイアログのタイトル
     */
    title: ReactNode;
    /**
     * ダイアログのサブタイトル
     */
    subtitle?: ReactNode;
    /**
     * ダイアログタイトルの HTML タグ
     */
    titleTag?: HeadingTagTypes;
    /**
     * アクションボタンのラベル
     */
    actionText: ReactNode;
    /**
     * アクションボタンのスタイル
     */
    actionTheme?: 'primary' | 'secondary' | 'danger';
    /**
     * アクションボタンをクリックした時に発火するコールバック関数
     * @param closeDialog - ダイアログを閉じる関数
     */
    onClickAction: (closeDialog: () => void) => void;
    /**
     * アクションボタンを無効にするかどうか
     */
    actionDisabled?: boolean;
    /**
     * 閉じるボタンを無効にするかどうか
     */
    closeDisabled?: boolean;
    /**
     * コンポーネントに適用するクラス名
     */
    className?: string;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'closeButtonLabel'>;
};
export type ActionDialogContentInnerProps = BaseProps & {
    onClickClose: () => void;
    responseMessage?: ResponseMessageType;
    titleId: string;
};
export declare const ActionDialogContentInner: FC<ActionDialogContentInnerProps>;
