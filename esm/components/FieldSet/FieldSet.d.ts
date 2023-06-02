import React, { FC, HTMLAttributes, ReactNode } from 'react';
import { HeadingTagTypes, HeadingTypes } from '../Heading';
import { Input } from '../Input';
type Props = Omit<React.ComponentProps<typeof Input>, 'error'> & {
    /** ラベル名 */
    label: ReactNode;
    /** ラベルのタイプ */
    labelType?: HeadingTypes;
    /** ラベル名の HTML 要素のタイプ */
    labelTagType?: HeadingTagTypes;
    /** input 要素の下に表示するエラーメッセージ */
    errorMessage?: ReactNode | ReactNode[];
    /** input 要素の下に表示するヘルプメッセージ */
    helpMessage?: ReactNode;
    /** ラベル部分の末尾に表示する内容 */
    labelSuffix?: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
/**
 * @deprecated `Fieldset` コンポーネントは非推奨です。代わりに `FormControl` を使ってください。
 */
export declare const FieldSet: FC<Props & ElementProps>;
export {};
