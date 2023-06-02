import { ReactNode, RefObject } from 'react';
export declare function useDialogPortal(parent?: HTMLElement | RefObject<HTMLElement>): {
    createPortal: (children: ReactNode) => import("react").ReactPortal | null;
};
