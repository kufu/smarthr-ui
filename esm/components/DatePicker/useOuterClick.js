var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import { useCallback, useEffect } from 'react';
export function useOuterClick(targets, callback) {
    var handleOuterClick = useCallback(function (e) {
        if (targets.some(function (target) { return isEventIncludedParent(e, target); })) {
            return;
        }
        callback(e);
    }, __spreadArrays(targets, [callback]));
    useEffect(function () {
        window.addEventListener('click', handleOuterClick);
        return function () {
            window.removeEventListener('click', handleOuterClick);
        };
    }, [handleOuterClick]);
}
function isElementIncludedParent(target, parent) {
    if (!target || !parent)
        return false;
    return target === parent || isElementIncludedParent(target.parentElement, parent);
}
function isEventIncludedParent(e, parent) {
    var path = e.composedPath && e.composedPath();
    if (!path) {
        // fallback for IE
        if (e.target instanceof Element) {
            return isElementIncludedParent(e.target, parent);
        }
        return false;
    }
    if (path.length === 0 || !parent)
        return false;
    return path.includes(parent);
}
//# sourceMappingURL=useOuterClick.js.map