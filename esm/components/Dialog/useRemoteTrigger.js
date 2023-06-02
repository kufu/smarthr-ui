import { useCallback, useEffect, useState } from 'react';
export const TRIGGER_EVENT = 'smarthr-ui:remote-dialog-trigger-dispatch';
export function useRemoteTrigger({ onClickClose: orgOnClickClose, id, }) {
    const [isOpen, setIsOpen] = useState(false);
    const onClickClose = useCallback(() => {
        if (orgOnClickClose) {
            return orgOnClickClose(() => {
                setIsOpen(false);
            });
        }
        setIsOpen(false);
    }, [orgOnClickClose]);
    useEffect(() => {
        const handler = ((e) => {
            if (id === e.detail.id) {
                setIsOpen(true);
            }
        });
        document.addEventListener(TRIGGER_EVENT, handler);
        return () => {
            document.removeEventListener(TRIGGER_EVENT, handler);
        };
    }, [id]);
    return {
        isOpen,
        onClickClose,
    };
}
//# sourceMappingURL=useRemoteTrigger.js.map