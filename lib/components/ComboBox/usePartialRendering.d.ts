import React from 'react';
export declare function usePartialRendering<T>({ items, minLength, }: {
    items: T[];
    minLength?: number;
}): {
    items: T[];
    renderIntersection: () => React.JSX.Element | null;
};
