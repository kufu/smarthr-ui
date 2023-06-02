import React, { cloneElement, useCallback, useMemo, useState } from 'react';
import { useId } from '../../../hooks/useId';
import { ActionDialog } from '../ActionDialog';
export const ActionDialogWithTrigger = ({ id, trigger, onClickTrigger, onClickClose, ...props }) => {
    const generatedId = useId();
    const actualId = id || generatedId;
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const onClickOpen = useCallback(() => {
        if (onClickTrigger) {
            return onClickTrigger(open);
        }
        open();
    }, [onClickTrigger, open]);
    const actualOnClickClose = useCallback(() => {
        if (onClickClose) {
            return onClickClose(close);
        }
        close();
    }, [onClickClose, close]);
    const actualTrigger = useMemo(() => cloneElement(trigger, {
        onClick: onClickOpen,
        'aria-haspopup': 'true',
        'aria-controls': actualId,
    }), [trigger, actualId, onClickOpen]);
    return (React.createElement(React.Fragment, null,
        actualTrigger,
        React.createElement(ActionDialog, { ...props, isOpen: isOpen, onClickClose: actualOnClickClose, id: actualId })));
};
//# sourceMappingURL=ActionDialogWithTrigger.js.map