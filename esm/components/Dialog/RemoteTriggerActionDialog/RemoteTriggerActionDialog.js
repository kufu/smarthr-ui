import React from 'react';
import { ActionDialog } from '../ActionDialog';
import { useRemoteTrigger } from '../useRemoteTrigger';
export const RemoteTriggerActionDialog = ({ id, onClickClose, ...props }) => {
    const { isOpen, onClickClose: actualOnClickClose } = useRemoteTrigger({ id, onClickClose });
    return React.createElement(ActionDialog, { ...props, id: id, isOpen: isOpen, onClickClose: actualOnClickClose });
};
//# sourceMappingURL=RemoteTriggerActionDialog.js.map