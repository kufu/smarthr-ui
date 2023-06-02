"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleEscape = void 0;
const react_1 = require("react");
const useHandleEscape = (cb) => {
    const handleKeyPress = (0, react_1.useCallback)((e) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        // Esc is a IE/Edge specific value
        if (e.key === 'Escape' || e.key === 'Esc') {
            cb();
        }
    }, [cb]);
    (0, react_1.useEffect)(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
};
exports.useHandleEscape = useHandleEscape;
//# sourceMappingURL=useHandleEscape.js.map