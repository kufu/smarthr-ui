import { ComponentProps, FC, FunctionComponentElement, HTMLAttributes, ReactNode } from 'react';
import { AbstractSize, CharRelativeSize } from '../../themes/createSpacing';
import { FaExclamationCircleIcon } from '../Icon';
type StyleProps = {
    /** コンポーネントの上端から、包含ブロックの上端までの間隔（基準フォントサイズの相対値または抽象値） */
    top?: CharRelativeSize | AbstractSize;
    /** コンポーネントの下端から、包含ブロックの下端までの間隔（基準フォントサイズの相対値または抽象値） */
    bottom?: CharRelativeSize | AbstractSize;
    /** コンポーネントの `z-index` 値 */
    zIndex?: number;
};
type Props = StyleProps & {
    /** 表示する `Button` または `AnchorButton` コンポーネント */
    primaryButton: ReactNode;
    /** 表示する `Button` または `AnchorButton` コンポーネント */
    secondaryButton?: ReactNode;
    /** tertiary 領域に表示するボタン */
    tertiaryButton?: ReactNode;
    /** エラーメッセージ */
    errorText?: ReactNode;
    /**
     * エラーメッセージのアイコン（`FaExclamationCircleIcon` を指定）
     */
    errorIcon?: FunctionComponentElement<ComponentProps<typeof FaExclamationCircleIcon>>;
    /** 上下の位置を固定するかどうか */
    fixed?: boolean;
    /** コンポーネントの幅 */
    width?: string;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const FloatArea: FC<Props & ElementProps>;
export {};
