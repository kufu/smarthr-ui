import React, { ButtonHTMLAttributes, VFC } from 'react';
import { HeadingTagTypes, HeadingTypes } from '../Heading';
type Props = {
    /** ヘッダ部分の内容 */
    children: React.ReactNode;
    /** ヘッダ部分のクラス名 */
    className?: string;
    /** ヘッダ部分のテキストのスタイル */
    headingType?: HeadingTypes;
    /** ヘッダ部分のタグ指定 */
    headingTag?: HeadingTagTypes;
};
type ElementProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof Props>;
export declare const AccordionPanelTrigger: VFC<Props & ElementProps>;
export {};
