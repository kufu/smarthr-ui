import { ComboBoxItem, ComboBoxOption } from './types';
export declare function useOptions<T>({ items, selected, creatable, inputValue, isFilteringDisabled, }: {
    items: Array<ComboBoxItem<T>>;
    selected: (ComboBoxItem<T> | null) | Array<ComboBoxItem<T>>;
    creatable: boolean;
    inputValue?: string;
    isFilteringDisabled?: boolean;
}): {
    options: ComboBoxOption<T>[];
};
