import { ReactNode, VFC } from 'react';
import { BaseElementProps } from '../Base';
type IconType = 'info' | 'success' | 'warning' | 'error';
type Props = {
    /** 表示する情報の種類 */
    type?: IconType;
    /** コンポーネントに適用するクラス名 */
    className?: string;
    /** 表示する情報の内容 */
    children: ReactNode;
};
export declare const CompactInformationPanel: VFC<Props & BaseElementProps>;
export {};
