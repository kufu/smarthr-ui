import { FC, HTMLAttributes, ReactNode } from 'react';
type Color = 'grey' | 'blue' | 'green' | 'red';
type State = 'warning' | 'error';
type Props = {
    /** ラベルが表す状態の種類 */
    type?: Color | State;
    /** 強調するかどうか */
    bold?: boolean;
    /** ラベル */
    children: ReactNode;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLSpanElement>, keyof Props>;
export declare const StatusLabel: FC<Props & ElementProps>;
export {};
