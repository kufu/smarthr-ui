import React, { InputHTMLAttributes, ReactNode } from 'react';
import { DecoratorsType } from '../../types/props';
type Size = 'default' | 's';
export type Props = {
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** コンポーネントの大きさ */
    size?: Size;
    /** フォームのラベル */
    label: ReactNode;
    /** ファイルの選択に変更があったときに発火するコールバック関数 */
    onChange?: (files: File[]) => void;
    /** `true` の時、フォームの枠の色が `DANGER` になる */
    error?: boolean;
    /** ファイルリストを表示するかどうか */
    hasFileList?: boolean;
    /** コンポーネント内のテキストを変更する関数 */
    decorators?: DecoratorsType<'destroy'>;
};
type ElementProps = Omit<InputHTMLAttributes<HTMLInputElement>, keyof Props>;
export declare const InputFile: React.ForwardRefExoticComponent<Props & ElementProps & React.RefAttributes<HTMLInputElement>>;
export {};
