import { useCallback, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
export function useDialogPortal(parent) {
    const portalContainer = useRef(typeof document === 'undefined' ? null : document.createElement('div')).current;
    useLayoutEffect(() => {
        if (!portalContainer) {
            return;
        }
        const parentElement = parent && 'current' in parent ? parent.current : parent;
        // SSR を考慮し、useEffect 内で初期値 document.body を指定
        const actualParent = parentElement || document.body;
        actualParent.appendChild(portalContainer);
        return () => {
            actualParent.removeChild(portalContainer);
        };
    }, [parent, portalContainer]);
    const wrappedCreatePortal = useCallback((children) => {
        if (portalContainer === null) {
            return null;
        }
        return createPortal(children, portalContainer);
    }, [portalContainer]);
    return {
        createPortal: wrappedCreatePortal,
    };
}
//# sourceMappingURL=useDialogPortal.js.map