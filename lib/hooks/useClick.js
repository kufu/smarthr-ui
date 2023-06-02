"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClick = void 0;
const react_1 = require("react");
function useClick(innerRefs, innerCallback, outerCallback) {
    const handleClick = (0, react_1.useCallback)((e) => {
        if (innerRefs.some((target) => isEventIncludedParent(e, target.current))) {
            innerCallback(e);
            return;
        }
        outerCallback(e);
    }, 
    // spread innerRefs to compare deps one by one
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...innerRefs, innerCallback, outerCallback]);
    (0, react_1.useEffect)(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [handleClick]);
}
exports.useClick = useClick;
function isEventIncludedParent(e, parent) {
    const path = e.composedPath();
    if (path.length === 0 || !parent)
        return false;
    return path.includes(parent);
}
//# sourceMappingURL=useClick.js.map