import React, { AnchorHTMLAttributes, ReactNode } from 'react';
type ElementProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props>;
type Props = {
    /** リンクをクリックした時に発火するコールバック関数 */
    onClick?: (e: React.MouseEvent) => void;
    /** テキストの前に表示するアイコン */
    prefix?: ReactNode;
    /** テキストの後ろに表示するアイコン */
    suffix?: ReactNode;
};
export declare const TextLink: React.ForwardRefExoticComponent<Props & ElementProps & React.RefAttributes<HTMLAnchorElement>>;
export {};
