import React, { FC } from 'react';
export declare type BaseProps = {
    title: string;
    description: React.ReactNode;
    closeText: string;
};
declare type Props = BaseProps & {
    onClickClose: () => void;
};
export declare const MessageDialogContentInner: FC<Props>;
export {};
