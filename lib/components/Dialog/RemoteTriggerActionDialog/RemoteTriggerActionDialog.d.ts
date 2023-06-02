import React from 'react';
import { ActionDialog } from '../ActionDialog';
import { useRemoteTrigger } from '../useRemoteTrigger';
type Props = Omit<React.ComponentProps<typeof ActionDialog>, 'isOpen' | 'onClickClose' | 'id'> & Parameters<typeof useRemoteTrigger>[0];
export declare const RemoteTriggerActionDialog: React.FC<Props>;
export {};
