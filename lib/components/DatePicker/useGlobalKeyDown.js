"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalKeyDown = void 0;
const react_1 = require("react");
function useGlobalKeyDown(callback) {
    (0, react_1.useEffect)(() => {
        window.addEventListener('keydown', callback);
        return () => {
            window.removeEventListener('keydown', callback);
        };
    }, [callback]);
}
exports.useGlobalKeyDown = useGlobalKeyDown;
//# sourceMappingURL=useGlobalKeyDown.js.map