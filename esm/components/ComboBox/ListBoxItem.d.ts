import React, { RefObject } from 'react';
import { ComboBoxOption } from './types';
type Props<T> = {
    option: ComboBoxOption<T>;
    isActive: boolean;
    onAdd: (option: ComboBoxOption<T>) => void;
    onSelect: (option: ComboBoxOption<T>) => void;
    onMouseOver: (option: ComboBoxOption<T>) => void;
    activeRef: RefObject<HTMLButtonElement>;
};
declare function ListBoxItem<T>({ option, isActive, onAdd, onSelect, onMouseOver, activeRef }: Props<T>): React.JSX.Element;
declare const Memoized: typeof ListBoxItem;
export { Memoized as ListBoxItem };
