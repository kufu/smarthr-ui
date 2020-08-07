import { useCallback, useEffect } from 'react';
export var useHandleEscape = function (cb) {
    var handleKeyPress = useCallback(function (e) {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        // Esc is a IE/Edge specific value
        if (e.key === 'Escape' || e.key === 'Esc') {
            cb();
        }
    }, [cb]);
    useEffect(function () {
        document.addEventListener('keydown', handleKeyPress);
        return function () { return document.removeEventListener('keydown', handleKeyPress); };
    }, [handleKeyPress]);
};
//# sourceMappingURL=useHandleEscape.js.map