import { ReactNode, VFC } from 'react';
declare function useId_OLD(defaultId?: string): string;
export declare const useId: typeof useId_OLD;
export declare const SequencePrefixIdProvider: VFC<{
    children: ReactNode;
}>;
export {};
