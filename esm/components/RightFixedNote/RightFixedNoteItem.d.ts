import React, { FC } from 'react';
export declare type ItemProps = {
    id: string;
    text: string;
    date?: string;
    author?: string;
    editLabel?: string;
    className?: string;
};
export declare type OnClickEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: string) => void;
declare type Props = ItemProps & {
    onClickEdit: OnClickEdit;
};
export declare const RightFixedNoteItem: FC<Props>;
export {};
