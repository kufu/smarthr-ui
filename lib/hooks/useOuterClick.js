"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOuterClick = void 0;
const react_1 = require("react");
function useOuterClick(targets, callback) {
    const handleOuterClick = (0, react_1.useCallback)((e) => {
        if (targets.some((target) => isEventIncludedParent(e, target.current))) {
            return;
        }
        callback(e);
    }, 
    // spread targets to compare deps one by one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...targets, callback]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('click', handleOuterClick);
        return () => {
            window.removeEventListener('click', handleOuterClick);
        };
    }, [handleOuterClick]);
}
exports.useOuterClick = useOuterClick;
function isEventIncludedParent(e, parent) {
    const path = e.composedPath();
    if (path.length === 0 || !parent)
        return false;
    return path.includes(parent);
}
//# sourceMappingURL=useOuterClick.js.map