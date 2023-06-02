import React, { useCallback, useContext } from 'react';
import { useId } from '../../../hooks/useId';
import { DialogContentInner } from '../DialogContentInner';
import { DialogContext } from '../DialogWrapper';
import { useDialogPortal } from '../useDialogPortal';
import { ActionDialogContentInner } from './ActionDialogContentInner';
export const ActionDialogContent = ({ children, title, actionText, actionTheme, onClickAction, actionDisabled = false, portalParent, className = '', decorators, ...props }) => {
    const { onClickClose, active } = useContext(DialogContext);
    const { createPortal } = useDialogPortal(portalParent);
    const handleClickClose = useCallback(() => {
        if (!active) {
            return;
        }
        onClickClose();
    }, [active, onClickClose]);
    const handleClickAction = useCallback(() => {
        if (!active) {
            return;
        }
        onClickAction(onClickClose);
    }, [active, onClickAction, onClickClose]);
    const titleId = useId();
    return createPortal(React.createElement(DialogContentInner, { ...props, onClickOverlay: onClickClose, onPressEscape: onClickClose, isOpen: active, ariaLabelledby: titleId, className: className },
        React.createElement(ActionDialogContentInner, { title: title, titleId: titleId, actionText: actionText, actionTheme: actionTheme, onClickAction: handleClickAction, onClickClose: handleClickClose, actionDisabled: actionDisabled, decorators: decorators }, children)));
};
//# sourceMappingURL=ActionDialogContent.js.map