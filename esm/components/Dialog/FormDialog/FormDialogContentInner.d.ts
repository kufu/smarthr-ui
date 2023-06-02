import { FC, ReactNode } from 'react';
import { DecoratorsType } from '../../../types/props';
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
    onSubmit: (closeDialog: () => void) => void;
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
type responseMessageType = {
    status: 'success' | 'error';
    text: ReactNode;
} | {
    status: 'processing';
};
export type FormDialogContentInnerProps = BaseProps & {
    onClickClose: () => void;
    responseMessage?: responseMessageType;
    titleId: string;
};
export declare const FormDialogContentInner: FC<FormDialogContentInnerProps>;
export {};
