import { useCallback, useEffect } from 'react';
export const useHandleEscape = (cb) => {
    const handleKeyPress = useCallback((e) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        // Esc is a IE/Edge specific value
        if (e.key === 'Escape' || e.key === 'Esc') {
            cb();
        }
    }, [cb]);
    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
};
//# sourceMappingURL=useHandleEscape.js.map