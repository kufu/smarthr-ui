import React, { FormHTMLAttributes, ReactNode, VFC } from 'react';
import { DecoratorsType } from '../../types/props';
import { ItemProps, OnClickEdit } from './RightFixedNoteItem';
type Props = {
    /** コンポーネントのタイトル */
    title: ReactNode;
    /** 表示するアイテムの配列 */
    items?: ItemProps[];
    /** コンポーネントの幅 */
    width?: number;
    /** textarea のラベル */
    textareaLabel?: ReactNode;
    /** edit ボタンを押下したときに発火するコールバック関数 */
    onClickEdit: OnClickEdit;
    /** submit ボタンを押下したときに発火するコールバック関数 */
    onSubmit: (e: React.FormEvent<HTMLFormElement>, text: string) => void;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'submitLabel'>;
};
type ElementProps = Omit<FormHTMLAttributes<HTMLFormElement>, keyof Props>;
export declare const RightFixedNote: VFC<Props & ElementProps>;
export {};
