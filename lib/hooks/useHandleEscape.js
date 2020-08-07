"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHandleEscape = void 0;
var react_1 = require("react");
exports.useHandleEscape = function (cb) {
    var handleKeyPress = react_1.useCallback(function (e) {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        // Esc is a IE/Edge specific value
        if (e.key === 'Escape' || e.key === 'Esc') {
            cb();
        }
    }, [cb]);
    react_1.useEffect(function () {
        document.addEventListener('keydown', handleKeyPress);
        return function () { return document.removeEventListener('keydown', handleKeyPress); };
    }, [handleKeyPress]);
};
//# sourceMappingURL=useHandleEscape.js.map