import React, { useCallback } from 'react';
import { useId } from '../../../hooks/useId';
import { DialogContentInner } from '../DialogContentInner';
import { useDialogPortal } from '../useDialogPortal';
import { ActionDialogContentInner } from './ActionDialogContentInner';
export const ActionDialog = ({ children, title, subtitle, titleTag, actionText, actionTheme, onClickAction, onClickClose, onPressEscape = onClickClose, responseMessage, actionDisabled = false, closeDisabled, className = '', portalParent, decorators, ...props }) => {
    const { createPortal } = useDialogPortal(portalParent);
    const titleId = useId();
    const handleClickClose = useCallback(() => {
        if (!props.isOpen) {
            return;
        }
        onClickClose();
    }, [onClickClose, props.isOpen]);
    const handleClickAction = useCallback(() => {
        if (!props.isOpen) {
            return;
        }
        onClickAction(onClickClose);
    }, [onClickAction, onClickClose, props.isOpen]);
    return createPortal(React.createElement(DialogContentInner, { ...props, ariaLabelledby: titleId, className: className, onPressEscape: onPressEscape },
        React.createElement(ActionDialogContentInner, { title: title, titleId: titleId, subtitle: subtitle, titleTag: titleTag, actionText: actionText, actionTheme: actionTheme, actionDisabled: actionDisabled, closeDisabled: closeDisabled, onClickClose: handleClickClose, onClickAction: handleClickAction, responseMessage: responseMessage, decorators: decorators }, children)));
};
//# sourceMappingURL=ActionDialog.js.map