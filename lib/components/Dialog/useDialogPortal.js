"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDialogPortal = void 0;
const react_1 = require("react");
const react_dom_1 = require("react-dom");
function useDialogPortal(parent) {
    const portalContainer = (0, react_1.useRef)(typeof document === 'undefined' ? null : document.createElement('div')).current;
    (0, react_1.useLayoutEffect)(() => {
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
    const wrappedCreatePortal = (0, react_1.useCallback)((children) => {
        if (portalContainer === null) {
            return null;
        }
        return (0, react_dom_1.createPortal)(children, portalContainer);
    }, [portalContainer]);
    return {
        createPortal: wrappedCreatePortal,
    };
}
exports.useDialogPortal = useDialogPortal;
//# sourceMappingURL=useDialogPortal.js.map