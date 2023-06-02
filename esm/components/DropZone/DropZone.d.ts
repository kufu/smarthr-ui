import React, { ChangeEvent, DragEvent, HTMLAttributes } from 'react';
import { DecoratorsType } from '../../types/props';
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof DropZoneProps>;
type DropZoneProps = {
    /**
     * ボタンまたはドラッグ&ドロップでファイルが追加された時に発火するコールバック関数
     */
    onSelectFiles: (e: DragEvent<HTMLElement> | ChangeEvent<HTMLInputElement>, files: FileList | null) => void;
    /**
     * 許可するファイル型を表す1つ以上の固有ファイル型指定子
     * <b>（ドラッグ&ドロップの挙動には影響しません）</b>
     */
    accept?: string;
    /** 複数ファイルを選択できるかどうか */
    multiple?: boolean;
    children?: React.ReactNode;
    name?: string;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'selectButtonLabel'>;
};
export declare const DropZone: React.ForwardRefExoticComponent<DropZoneProps & ElementProps & React.RefAttributes<HTMLInputElement>>;
export {};
