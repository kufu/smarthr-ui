import React, { createContext, useContext, useMemo } from 'react';
var defaultContext = {
    prefix: 0,
    current: 0,
};
var IdContext = createContext(defaultContext);
export function useId(defaultId) {
    var context = useContext(IdContext);
    return useMemo(function () { return defaultId || "id-" + context.prefix + "-" + ++context.current; }, [
        defaultId,
        context,
    ]);
}
export var SequencePrefixIdProvider = function (_a) {
    var children = _a.children;
    var context = useContext(IdContext);
    // increment `prefix` and reset `current` to 0 on every Provider
    var value = {
        prefix: context.prefix + 1,
        current: 0,
    };
    return React.createElement(IdContext.Provider, { value: value }, children);
};
//# sourceMappingURL=useId.js.map