import { useEffect } from 'react';
export function useGlobalKeyDown(callback) {
    useEffect(() => {
        window.addEventListener('keydown', callback);
        return () => {
            window.removeEventListener('keydown', callback);
        };
    }, [callback]);
}
//# sourceMappingURL=useGlobalKeyDown.js.map