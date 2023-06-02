import React, { HTMLAttributes, ReactNode } from 'react';
import { DecoratorsType } from '../../../types/props';
type Category = {
    type?: string;
    heading: ReactNode;
    items: Array<{
        label: ReactNode;
        url: string;
        target?: string;
    }>;
};
type Props = {
    apps: Category[];
    urlToShowAll?: string | null;
    /** コンポーネント内の文言を変更するための関数を設定 */
    decorators?: DecoratorsType<'triggerLabel'>;
};
type ElementProps = Omit<HTMLAttributes<HTMLElement>, keyof Props>;
export declare const AppLauncher: React.FC<Props & ElementProps>;
export {};
