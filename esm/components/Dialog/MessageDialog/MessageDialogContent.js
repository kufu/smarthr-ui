import React, { useCallback, useContext } from 'react';
import { useId } from '../../../hooks/useId';
import { DialogContentInner } from '../DialogContentInner';
import { DialogContext } from '../DialogWrapper';
import { useDialogPortal } from '../useDialogPortal';
import { MessageDialogContentInner } from './MessageDialogContentInner';
export const MessageDialogContent = ({ title, description, portalParent, className = '', decorators, ...props }) => {
    const { onClickClose, active } = useContext(DialogContext);
    const { createPortal } = useDialogPortal(portalParent);
    const handleClickClose = useCallback(() => {
        if (!active) {
            return;
        }
        onClickClose();
    }, [active, onClickClose]);
    const titleId = useId();
    return createPortal(React.createElement(DialogContentInner, { ...props, onClickOverlay: onClickClose, onPressEscape: onClickClose, isOpen: active, className: className },
        React.createElement(MessageDialogContentInner, { title: title, titleId: titleId, description: description, onClickClose: handleClickClose, decorators: decorators })));
};
//# sourceMappingURL=MessageDialogContent.js.map