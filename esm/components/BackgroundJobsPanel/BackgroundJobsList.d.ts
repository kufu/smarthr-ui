import React, { HTMLAttributes, VFC } from 'react';
type Props = {
    children?: React.ReactNode;
};
type ElementProps = Omit<HTMLAttributes<HTMLUListElement>, keyof Props>;
declare const BackgroundJobsList: VFC<Props & ElementProps>;
declare const Item: import("styled-components").StyledComponent<"li", any, {}, never>;
declare const ListAndItem: typeof BackgroundJobsList & {
    Item: typeof Item;
};
export { ListAndItem as BackgroundJobsList };
