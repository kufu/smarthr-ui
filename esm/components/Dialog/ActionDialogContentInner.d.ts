import React, { FC } from 'react';
export declare type BaseProps = {
    children: React.ReactNode;
    title: string;
    closeText: string;
    actionText: string;
    actionTheme: 'primary' | 'secondary' | 'danger';
    onClickAction: (closeDialog: () => void) => void;
    actionDisabled?: boolean;
};
declare type Props = BaseProps & {
    onClickClose: () => void;
};
export declare const ActionDialogContentInner: FC<Props>;
export {};
