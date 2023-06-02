import React, { ReactElement } from 'react';
export declare const RemoteDialogTrigger: React.FC<{
    targetId: string;
    onClick?: (open: () => void) => void;
    children: Omit<ReactElement, 'onClick' | 'aria-haspopup' | 'aria-controls'>;
}>;
