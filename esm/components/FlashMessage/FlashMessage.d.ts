import { FC } from 'react';
declare type Props = {
    visible: boolean;
    type: 'success' | 'info' | 'warning' | 'error' | '';
    text: string;
    className?: string;
    onClose: () => void;
};
export declare const FlashMessage: FC<Props>;
export {};
