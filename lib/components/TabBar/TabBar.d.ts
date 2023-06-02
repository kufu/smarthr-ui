import { HTMLAttributes, ReactNode, VFC } from 'react';
type Props = {
    /** タブバーの内容。通常は TabItem を並べる。 */
    children: ReactNode;
    /** `true` のとき、TabBar に下線を表示する */
    bordered?: boolean;
    /** コンポーネントに適用するクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props | 'role'>;
export declare const TabBar: VFC<Props & ElementProps>;
export {};
