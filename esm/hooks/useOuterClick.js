import { useCallback, useEffect } from 'react';
export function useOuterClick(targets, callback) {
    const handleOuterClick = useCallback((e) => {
        if (targets.some((target) => isEventIncludedParent(e, target.current))) {
            return;
        }
        callback(e);
    }, 
    // spread targets to compare deps one by one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...targets, callback]);
    useEffect(() => {
        window.addEventListener('click', handleOuterClick);
        return () => {
            window.removeEventListener('click', handleOuterClick);
        };
    }, [handleOuterClick]);
}
function isEventIncludedParent(e, parent) {
    const path = e.composedPath();
    if (path.length === 0 || !parent)
        return false;
    return path.includes(parent);
}
//# sourceMappingURL=useOuterClick.js.map