import { cloneElement, useCallback, useMemo } from 'react';
import { TRIGGER_EVENT } from './useRemoteTrigger';
const onClickRemoteDialogTrigger = (e) => {
    document.dispatchEvent(new CustomEvent(TRIGGER_EVENT, {
        detail: { id: e.currentTarget.getAttribute('aria-controls') },
    }));
};
export const RemoteDialogTrigger = ({ targetId, children, onClick }) => {
    const actualOnClick = useCallback((e) => {
        if (onClick) {
            return onClick(() => {
                onClickRemoteDialogTrigger(e);
            });
        }
        onClickRemoteDialogTrigger(e);
    }, [onClick]);
    const actualTrigger = useMemo(() => cloneElement(children, {
        onClick: actualOnClick,
        'aria-haspopup': 'true',
        'aria-controls': targetId,
    }), [children, targetId, actualOnClick]);
    return actualTrigger;
};
//# sourceMappingURL=RemoteDialogTrigger.js.map