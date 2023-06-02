import React, { TextareaHTMLAttributes } from 'react';
import { DecoratorsType } from '../../types/props';
type Props = {
    /** 入力値にエラーがあるかどうか */
    error?: boolean;
    /** コンポーネントの幅 */
    width?: number | string;
    /** 自動でフォーカスされるかどうか */
    autoFocus?: boolean;
    /** 自動で広がるかどうか */
    autoResize?: boolean;
    /** 最大行数。超えるとスクロールする。初期値は無限 */
    maxRows?: number;
    /** 行数の初期値。省略した場合は2 */
    rows?: number;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'beforeMaxLengthCount' | 'afterMaxLengthCount'>;
    /**
     * @deprecated placeholder属性は非推奨です。別途ヒント用要素の設置を検討してください。
     */
    placeholder?: string;
};
type ElementProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof Props>;
export declare const Textarea: React.ForwardRefExoticComponent<Props & ElementProps & React.RefAttributes<HTMLTextAreaElement>>;
export {};
