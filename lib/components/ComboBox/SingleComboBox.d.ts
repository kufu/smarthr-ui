import React, { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { DecoratorsType } from '../../types/props';
import { Input } from '../Input';
import { BaseProps, ComboBoxItem } from './types';
type Props<T> = BaseProps<T> & {
    /**
     * 選択されているアイテム
     */
    selectedItem: ComboBoxItem<T> | null;
    /**
     * デフォルトで選択されるアイテム
     */
    defaultItem?: ComboBoxItem<T>;
    /**
     * コンポーネント内の先頭に表示する内容
     */
    prefix?: ReactNode;
    /**
     * 選択されているアイテムがクリアされた時に発火するコールバック関数
     */
    onClear?: () => void;
    /**
     * 選択されているアイテムがクリアされた時に発火するコールバック関数
     * 指定している場合、クリア時にonClickを実行せずにonClearClickのみ実行する
     */
    onClearClick?: (e: MouseEvent) => void;
    /**
     * 選択されているアイテムのリストが変わった時に発火するコールバック関数
     */
    onChangeSelected?: (selectedItem: ComboBoxItem<T> | null) => void;
    /**
     * コンポーネント内のテキストを変更する関数/
     */
    decorators?: DecoratorsType<'noResultText'> & {
        destroyButtonIconAlt?: (text: string) => string;
    };
    /**
     * input 要素の属性
     */
    inputAttributes?: Omit<React.ComponentProps<typeof Input>, 'aria-activedescendant' | 'aria-autocomplete' | 'autoComplete' | 'className' | 'disabled' | 'required' | 'error' | 'name' | 'onChange' | 'onClick' | 'onCompositionEnd' | 'onCompositionStart' | 'onFocus' | 'onKeyDown' | 'placeholder' | 'prefix' | 'ref' | 'suffix' | 'type' | 'value'>;
};
type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>;
export declare function SingleComboBox<T>({ items, selectedItem, defaultItem, name, disabled, required, prefix, error, creatable, placeholder, dropdownHelpMessage, isLoading, width, dropdownWidth, className, onChange, onChangeInput, onAdd, onSelect, onClear, onClearClick, onChangeSelected, decorators, inputAttributes, ...props }: Props<T> & ElementProps<T>): React.JSX.Element;
export {};
