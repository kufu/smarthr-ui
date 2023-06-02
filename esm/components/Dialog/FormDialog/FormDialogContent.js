import React, { useCallback, useContext } from 'react';
import { useId } from '../../../hooks/useId';
import { DialogContentInner } from '../DialogContentInner';
import { DialogContext } from '../DialogWrapper';
import { useDialogPortal } from '../useDialogPortal';
import { FormDialogContentInner } from './FormDialogContentInner';
export const FormDialogContent = ({ children, title, actionText, actionTheme, onSubmit, actionDisabled = false, portalParent, className = '', decorators, ...props }) => {
    const { onClickClose, active } = useContext(DialogContext);
    const { createPortal } = useDialogPortal(portalParent);
    const handleClickClose = useCallback(() => {
        if (!active) {
            return;
        }
        onClickClose();
    }, [active, onClickClose]);
    const handleSubmitAction = useCallback(() => {
        if (!active) {
            return;
        }
        onSubmit(onClickClose);
    }, [active, onSubmit, onClickClose]);
    const titleId = useId();
    return createPortal(React.createElement(DialogContentInner, { ...props, onClickOverlay: onClickClose, onPressEscape: onClickClose, isOpen: active, ariaLabelledby: titleId, className: className },
        React.createElement(FormDialogContentInner, { title: title, titleId: titleId, actionText: actionText, actionTheme: actionTheme, onSubmit: handleSubmitAction, onClickClose: handleClickClose, actionDisabled: actionDisabled, decorators: decorators }, children)));
};
//# sourceMappingURL=FormDialogContent.js.map