"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGlobalKeyDown = void 0;
var react_1 = require("react");
function useGlobalKeyDown(callback) {
    react_1.useEffect(function () {
        window.addEventListener('keydown', callback);
        return function () {
            window.removeEventListener('keydown', callback);
        };
    }, [callback]);
}
exports.useGlobalKeyDown = useGlobalKeyDown;
//# sourceMappingURL=useGlobalKeyDown.js.map