import React from 'react';
type DialogContextType = {
    onClickTrigger: () => void;
    onClickClose: () => void;
    active: boolean;
};
export declare const DialogContext: React.Context<DialogContextType>;
export declare const DialogWrapper: React.VFC<{
    children?: React.ReactNode;
}>;
export {};
