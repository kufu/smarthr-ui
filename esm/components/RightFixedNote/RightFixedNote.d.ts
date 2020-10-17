import React, { FC } from 'react';
import { ItemProps, OnClickEdit } from './RightFixedNoteItem';
interface Props {
    title?: string;
    items?: ItemProps[];
    submitLabel?: string;
    width?: number;
    textareaLabel?: string;
    enableEdit?: boolean;
    onClickEdit: OnClickEdit;
    onSubmit: (e: React.FormEvent<HTMLFormElement>, text: string) => void;
    className?: string;
}
export declare const RightFixedNote: FC<Props>;
export {};
