import React, { VFC } from 'react';
import { DecoratorsType } from '../../../types/props';
import { HeadingTagTypes } from '../../Heading';
export type BaseProps = {
    /**
     * ダイアログのタイトル
     */
    title: React.ReactNode;
    /**
     * ダイアログのサブタイトル
     */
    subtitle?: React.ReactNode;
    /**
     * ダイアログタイトルの HTML タグ
     */
    titleTag?: HeadingTagTypes;
    /**
     * ダイアログの説明
     */
    description: React.ReactNode;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'closeButtonLabel'>;
};
export type MessageDialogContentInnerProps = BaseProps & {
    onClickClose: () => void;
    titleId: string;
};
export declare const MessageDialogContentInner: VFC<MessageDialogContentInnerProps>;
