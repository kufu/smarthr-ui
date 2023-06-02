import React, { createContext, useContext, useMemo } from 'react';
const defaultContext = {
    prefix: 0,
    current: 0,
};
const IdContext = createContext(defaultContext);
function useId_OLD(defaultId) {
    const context = useContext(IdContext);
    return useMemo(() => defaultId || `id-${context.prefix}-${++context.current}`, [defaultId, context]);
}
export const useId = 
// React v18 以降は React.useId を使う
'useId' in React ? React.useId : useId_OLD;
export const SequencePrefixIdProvider = ({ children }) => {
    const context = useContext(IdContext);
    // increment `prefix` and reset `current` to 0 on every Provider
    const value = {
        prefix: context.prefix + 1,
        current: 0,
    };
    return React.createElement(IdContext.Provider, { value: value }, children);
};
//# sourceMappingURL=useId.js.map