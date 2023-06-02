import React from 'react';
import { DialogContentInner } from './DialogContentInner';
import { useDialogPortal } from './useDialogPortal';
export const Dialog = ({ children, className = '', portalParent, ...props }) => {
    const { createPortal } = useDialogPortal(portalParent);
    return createPortal(React.createElement(DialogContentInner, { ...props, className: className }, children));
};
//# sourceMappingURL=Dialog.js.map