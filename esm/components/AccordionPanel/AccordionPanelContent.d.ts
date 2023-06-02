import React, { HTMLAttributes, VFC } from 'react';
type Props = {
    /** パネル部分の内容 */
    children: React.ReactNode;
    /** パネル部分のクラス名 */
    className?: string;
};
type ElementProps = Omit<HTMLAttributes<HTMLDivElement>, keyof Props>;
export declare const AccordionPanelContent: VFC<Props & ElementProps>;
export {};
