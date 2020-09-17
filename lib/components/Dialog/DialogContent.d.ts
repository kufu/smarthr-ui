import React from 'react';
declare type DialogContentContextType = {
    onClickClose: () => void;
};
export declare const DialogContentContext: React.Context<DialogContentContextType>;
declare type Props = {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};
export declare const DialogContent: React.FC<Props>;
export {};
