import React, { useCallback } from 'react';
import { useId } from '../../../hooks/useId';
import { DialogContentInner } from '../DialogContentInner';
import { useDialogPortal } from '../useDialogPortal';
import { MessageDialogContentInner, } from './MessageDialogContentInner';
export const MessageDialog = ({ title, subtitle, titleTag, description, onClickClose, onPressEscape = onClickClose, className = '', portalParent, decorators, ...props }) => {
    const { createPortal } = useDialogPortal(portalParent);
    const handleClickClose = useCallback(() => {
        if (!props.isOpen) {
            return;
        }
        onClickClose();
    }, [onClickClose, props.isOpen]);
    const titleId = useId();
    return createPortal(React.createElement(DialogContentInner, { ...props, "aria-labelledby": titleId, className: className, onPressEscape: onPressEscape },
        React.createElement(MessageDialogContentInner, { title: title, titleId: titleId, subtitle: subtitle, description: description, onClickClose: handleClickClose, decorators: decorators })));
};
//# sourceMappingURL=MessageDialog.js.map