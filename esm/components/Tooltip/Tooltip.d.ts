import { FC, HTMLAttributes, ReactNode } from 'react';
import { Props as BalloonProps } from '../Balloon';
type Props = {
    /** ツールチップ内に表示するメッセージ */
    message: ReactNode;
    /** ツールチップを表示する対象の要素 */
    children: ReactNode;
    /** ツールチップを表示する対象のタイプ。アイコンの場合は `icon` を指定する */
    triggerType?: 'icon' | 'text';
    /** ツールチップ内を複数行で表示する場合に `true` を指定する */
    multiLine?: boolean;
    /** `true` のとき、ツールチップを表示する対象が省略されている場合のみツールチップ表示を有効にする */
    ellipsisOnly?: boolean;
    /** 水平方向の位置 */
    horizontal?: BalloonProps['horizontal'] | 'auto';
    /** 垂直方向の位置 */
    vertical?: BalloonProps['vertical'] | 'auto';
    /** ツールチップを表示する対象の tabIndex 値 */
    tabIndex?: number;
    /** ツールチップを内包要素に紐付けるかどうか */
    ariaDescribedbyTarget?: 'wrapper' | 'inner';
    /** ツールチップの要素を表示するルート要素 */
    portalRootElement?: HTMLElement;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'aria-describedby'>;
export declare const Tooltip: FC<Props & ElementProps>;
export {};
