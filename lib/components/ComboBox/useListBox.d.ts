import React, { KeyboardEvent, ReactNode, RefObject } from 'react';
import { DecoratorsType } from '../../types/props';
import { ComboBoxItem, ComboBoxOption } from './types';
type Props<T> = {
    options: Array<ComboBoxOption<T>>;
    dropdownHelpMessage?: ReactNode;
    dropdownWidth?: string | number;
    onAdd?: (label: string) => void;
    onSelect: (item: ComboBoxItem<T>) => void;
    isExpanded: boolean;
    isLoading?: boolean;
    triggerRef: RefObject<HTMLElement>;
    decorators?: DecoratorsType<'noResultText'>;
};
export declare function useListBox<T>({ options, dropdownHelpMessage, dropdownWidth, onAdd, onSelect, isExpanded, isLoading, triggerRef, decorators, }: Props<T>): {
    renderListBox: () => React.ReactPortal | null;
    activeOption: ComboBoxOption<T> | null;
    handleKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
    listBoxId: string;
    listBoxRef: React.RefObject<HTMLDivElement>;
};
export {};
