import React from 'react';
import { FormDialog } from '../FormDialog';
import { useRemoteTrigger } from '../useRemoteTrigger';
type Props = Omit<React.ComponentProps<typeof FormDialog>, 'isOpen' | 'onClickClose' | 'id'> & Parameters<typeof useRemoteTrigger>[0];
export declare const RemoteTriggerFormDialog: React.FC<Props>;
export {};
