import React, { ReactNode } from 'react';
export declare function usePortal(): {
    portalRoot: HTMLDivElement | null;
    isChildPortal: (element: HTMLElement | null) => boolean;
    PortalParentProvider: React.VFC<{
        children: ReactNode;
    }>;
    createPortal: (children: ReactNode) => React.ReactPortal | null;
};
