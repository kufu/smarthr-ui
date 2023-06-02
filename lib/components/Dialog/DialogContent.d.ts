import React from 'react';
import { DireactChildren, UncontrolledDialogProps } from './types';
type DialogContentContextType = {
    onClickClose: () => void;
};
export declare const DialogContentContext: React.Context<DialogContentContextType>;
type Props = UncontrolledDialogProps & DireactChildren;
export declare const DialogContent: React.VFC<Props>;
export {};
