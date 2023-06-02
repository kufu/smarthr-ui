import React from 'react';
import { FormDialog } from '../FormDialog';
import { useRemoteTrigger } from '../useRemoteTrigger';
export const RemoteTriggerFormDialog = ({ id, onClickClose, ...props }) => {
    const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({ id, onClickClose });
    return React.createElement(FormDialog, { ...props, id: id, isOpen: isOpen, onClickClose: actualOnClickClose });
};
//# sourceMappingURL=RemoteTriggerFormDialog.js.map