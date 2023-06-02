import React from 'react';
import { MessageDialog } from '../MessageDialog';
import { useRemoteTrigger } from '../useRemoteTrigger';
type Props = Omit<React.ComponentProps<typeof MessageDialog>, 'isOpen' | 'onClickClose' | 'id'> & Parameters<typeof useRemoteTrigger>[0];
export declare const RemoteTriggerMessageDialog: React.FC<Props>;
export {};
