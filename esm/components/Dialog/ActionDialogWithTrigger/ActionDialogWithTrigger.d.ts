import React, { ReactElement } from 'react';
import { ActionDialog } from '../ActionDialog';
type ToggleModalActionType = () => void;
export declare const ActionDialogWithTrigger: React.FC<Omit<React.ComponentProps<typeof ActionDialog>, 'isOpen' | 'onClickClose'> & {
    trigger: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls'>;
    onClickTrigger?: (open: ToggleModalActionType) => void;
    onClickClose?: (close: ToggleModalActionType) => void;
}>;
export {};
