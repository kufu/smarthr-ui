import React, { ComponentProps, HTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { HeadingTypes } from '../Heading';
import { StatusLabel } from '../StatusLabel';
import type { Gap } from '../Layout';
type StatusLabelProps = ComponentProps<typeof StatusLabel>;
type Props = PropsWithChildren<{
    /** グループのタイトル名 */
    title: ReactNode;
    /** タイトルの見出しのタイプ */
    titleType?: HeadingTypes;
    /** label 要素に適用する `htmlFor` 値 */
    htmlFor?: string;
    /** label 要素に適用する `id` 値 */
    labelId?: string;
    /** タイトル群と子要素の間の間隔調整用（基本的には不要） */
    innerMargin?: Gap;
    /** タイトルの隣に表示する `StatusLabel` の Props の配列 */
    statusLabelProps?: StatusLabelProps | StatusLabelProps[];
    /** タイトルの下に表示するヘルプメッセージ */
    helpMessage?: ReactNode;
    /** タイトルの下に表示する入力例 */
    exampleMessage?: ReactNode;
    /** タイトルの下に表示するエラーメッセージ */
    errorMessages?: ReactNode | ReactNode[];
    /** フォームコントロールの下に表示する補足メッセージ */
    supplementaryMessage?: ReactNode;
    /** `true` のとき、文字色を `TEXT_DISABLED` にする */
    disabled?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    as?: string | React.ComponentType<any>;
}>;
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-labelledby'>;
/**
 * @deprecated `FormGroup` コンポーネントは非推奨です。代わりに `FormControl` や `Fieldset` を使ってください。
 */
export declare const FormGroup: React.FC<Props & ElementProps>;
export {};
