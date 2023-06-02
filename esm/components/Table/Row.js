import React from 'react';
import { useClassNames } from './useClassNames';
/**
 * @deprecated Row コンポーネントは非推奨です。tr 要素に置き換えてください。
 */
export const Row = ({ className = '', children, ...props }) => {
    const classNames = useClassNames().row;
    return (React.createElement("tr", { ...props, className: `${className} ${classNames.wrapper}` }, children));
};
//# sourceMappingURL=Row.js.map