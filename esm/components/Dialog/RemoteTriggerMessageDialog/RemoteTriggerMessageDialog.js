import React from 'react';
import { MessageDialog } from '../MessageDialog';
import { useRemoteTrigger } from '../useRemoteTrigger';
export const RemoteTriggerMessageDialog = ({ id, onClickClose, ...props }) => {
    const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({ id, onClickClose });
    return React.createElement(MessageDialog, { ...props, id: id, isOpen: isOpen, onClickClose: actualOnClickClose });
};
//# sourceMappingURL=RemoteTriggerMessageDialog.js.map