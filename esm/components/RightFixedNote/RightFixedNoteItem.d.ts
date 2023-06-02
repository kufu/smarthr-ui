import React, { ReactNode, VFC } from 'react';
export type ItemProps = {
    /** アイテムを特定するための識別子 */
    id: string;
    /** 表示するテキスト */
    text: ReactNode;
    /** このアイテムが追加された日付 */
    date?: ReactNode;
    /** このアイテムの著者 */
    author?: ReactNode;
    /** edit ボタンの aria-label */
    editLabel?: string;
    /** このコンポーネントに適用するクラス名 */
    className?: string;
};
export type OnClickEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void;
type Props = ItemProps & {
    onClickEdit: OnClickEdit;
};
export declare const RightFixedNoteItem: VFC<Props>;
export {};
