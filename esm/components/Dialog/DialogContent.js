import React, { createContext, useContext } from 'react';
import { DialogContentInner } from './DialogContentInner';
import { DialogContext } from './DialogWrapper';
import { useDialogPortal } from './useDialogPortal';
export const DialogContentContext = createContext({
    onClickClose: () => {
        /* noop */
    },
});
export const DialogContent = ({ portalParent, children, ...props }) => {
    const { onClickClose, active } = useContext(DialogContext);
    const { createPortal } = useDialogPortal(portalParent);
    return createPortal(React.createElement(DialogContentContext.Provider, { value: { onClickClose } },
        React.createElement(DialogContentInner, { ...props, isOpen: active, onClickOverlay: onClickClose, onPressEscape: onClickClose }, children)));
};
//# sourceMappingURL=DialogContent.js.map