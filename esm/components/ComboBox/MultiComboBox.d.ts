import React, { HTMLAttributes, InputHTMLAttributes } from 'react';
import { DecoratorsType } from '../../types/props';
import { BaseProps, ComboBoxItem } from './types';
type Props<T> = BaseProps<T> & {
    /**
     * 選択されているアイテムのリスト
     */
    selectedItems: Array<ComboBoxItem<T> & {
        deletable?: boolean;
    }>;
    /**
     * 選択されているアイテムのラベルを省略表示するかどうか
     */
    selectedItemEllipsis?: boolean;
    /**
     * テキストボックスの `value` 属性の値。
     * `onChangeInput` と併せて設定することで、テキストボックスの挙動が制御可能になる。
     */
    inputValue?: string;
    /**
     * 選択されているアイテムの削除ボタンがクリックされた時に発火するコールバック関数
     */
    onDelete?: (item: ComboBoxItem<T>) => void;
    /**
     * 選択されているアイテムのリストが変わった時に発火するコールバック関数
     */
    onChangeSelected?: (selectedItems: Array<ComboBoxItem<T>>) => void;
    /**
     * コンポーネントがフォーカスされたときに発火するコールバック関数
     */
    onFocus?: () => void;
    /**
     * コンポーネントからフォーカスが外れた時に発火するコールバック関数
     */
    onBlur?: () => void;
    /**
     * コンポーネント内のテキストを変更する関数/
     */
    decorators?: DecoratorsType<'noResultText'> & {
        destroyButtonIconAlt?: (text: string) => string;
        selectedListAriaLabel?: (text: string) => string;
    };
    /**
     * input 要素の属性
     */
    inputAttributes?: Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'disabled' | 'required' | 'type' | 'aria-activedescendant' | 'aria-autocomplete' | 'aria-controls' | 'aria-disabled' | 'aria-expanded' | 'aria-haspopup' | 'aria-invalid' | 'autoComplete' | 'className' | 'onChange' | 'onCompositionEnd' | 'onCompositionStart' | 'onFocus' | 'onKeyDown' | 'ref' | 'role' | 'tabIndex' | 'value'>;
};
type ElementProps<T> = Omit<HTMLAttributes<HTMLDivElement>, keyof Props<T>>;
export declare function MultiComboBox<T>({ items, selectedItems, name, disabled, required, error, creatable, placeholder, dropdownHelpMessage, isLoading, selectedItemEllipsis, width, dropdownWidth, inputValue: controlledInputValue, className, onChange, onChangeInput, onAdd, onDelete, onSelect, onChangeSelected, onFocus, onBlur, decorators, inputAttributes, ...props }: Props<T> & ElementProps<T>): React.JSX.Element;
export {};
