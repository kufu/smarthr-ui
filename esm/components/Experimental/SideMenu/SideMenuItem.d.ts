import React, { AnchorHTMLAttributes, HTMLAttributes, PropsWithChildren } from 'react';
type Props = PropsWithChildren<{
    /** 現在地かどうか */
    current?: boolean;
}>;
type ElementProps = Omit<HTMLAttributes<HTMLLIElement>, keyof Props>;
type InnerLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof Props & keyof ElementProps>;
export declare const SideMenuItem: React.FC<Props & ElementProps & InnerLinkProps>;
export {};
