import { useCallback, useEffect } from 'react';
export function useClick(innerRefs, innerCallback, outerCallback) {
    const handleClick = useCallback((e) => {
        if (innerRefs.some((target) => isEventIncludedParent(e, target.current))) {
            innerCallback(e);
            return;
        }
        outerCallback(e);
    }, 
    // spread innerRefs to compare deps one by one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...innerRefs, innerCallback, outerCallback]);
    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [handleClick]);
}
function isEventIncludedParent(e, parent) {
    const path = e.composedPath();
    if (path.length === 0 || !parent)
        return false;
    return path.includes(parent);
}
//# sourceMappingURL=useClick.js.map