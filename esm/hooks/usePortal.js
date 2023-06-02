import React, { createContext, useCallback, useContext, useMemo, useRef, } from 'react';
import { createPortal } from 'react-dom';
import { useEnhancedEffect } from './useEnhancedEffect';
const ParentContext = createContext({
    seqs: [],
});
let portalSeq = 0;
export function usePortal() {
    const portalRoot = useRef(typeof document === 'undefined' ? null : document.createElement('div')).current;
    const currentSeq = useMemo(() => ++portalSeq, []);
    const parent = useContext(ParentContext);
    const parentSeqs = parent.seqs.concat(currentSeq);
    useEnhancedEffect(() => {
        if (!portalRoot) {
            return;
        }
        portalRoot.dataset.portalChildOf = parentSeqs.join(',');
        document.body.appendChild(portalRoot);
        return () => {
            document.body.removeChild(portalRoot);
        };
        // spread parentSeqs array for deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...parentSeqs]);
    const isChildPortal = useCallback((element) => {
        return _isChildPortal(element, currentSeq);
    }, [currentSeq]);
    const PortalParentProvider = useCallback(({ children }) => {
        const value = {
            seqs: parentSeqs,
        };
        return React.createElement(ParentContext.Provider, { value: value }, children);
    }, 
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...parentSeqs]);
    const wrappedCreatePortal = useCallback((children) => {
        if (portalRoot === null) {
            return null;
        }
        return createPortal(children, portalRoot);
    }, [portalRoot]);
    return {
        portalRoot,
        isChildPortal,
        PortalParentProvider,
        createPortal: wrappedCreatePortal,
    };
}
function _isChildPortal(element, parentPortalSeq) {
    if (!element)
        return false;
    const childOf = element.dataset?.portalChildOf || '';
    const includesSeq = childOf.split(',').includes(String(parentPortalSeq));
    return includesSeq || _isChildPortal(element.parentElement, parentPortalSeq);
}
//# sourceMappingURL=usePortal.js.map