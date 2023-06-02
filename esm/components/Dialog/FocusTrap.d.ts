import { ReactNode, RefObject, VFC } from 'react';
type Props = {
    firstFocusTarget?: RefObject<HTMLElement>;
    children: ReactNode;
};
export declare const FocusTrap: VFC<Props>;
export {};
