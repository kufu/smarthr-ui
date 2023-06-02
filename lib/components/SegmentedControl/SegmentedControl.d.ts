import { HTMLAttributes, ReactNode, VFC } from 'react';
export type Option = {
    /** 選択時に返される値 */
    value: string;
    /** ボタンに表示する内容 */
    content: ReactNode;
    /** ボタンの `aria-label` */
    ariaLabel?: string;
    /** ボタンを disabled にするかどうか */
    disabled?: boolean;
};
type Props = {
    /** 選択肢の配列 */
    options: Option[];
    /** 選択中の値 */
    value?: string | null;
    /** 選択肢を押下したときに発火するコールバック関数 */
    onClickOption?: (value: string) => void;
    /** 各ボタンの大きさ */
    size?: 'default' | 's';
    /** 各ボタンを正方形にするかどうか。アイコンボタンを使用する場合に指定します。 */
    isSquare?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const SegmentedControl: VFC<Props & ElementProps>;
export {};
