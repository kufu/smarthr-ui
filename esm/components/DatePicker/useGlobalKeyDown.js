import { useEffect } from 'react';
export function useGlobalKeyDown(callback) {
    useEffect(function () {
        window.addEventListener('keydown', callback);
        return function () {
            window.removeEventListener('keydown', callback);
        };
    }, [callback]);
}
//# sourceMappingURL=useGlobalKeyDown.js.map