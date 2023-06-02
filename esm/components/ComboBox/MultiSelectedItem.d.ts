import React, { RefObject } from 'react';
import { ComboBoxItem } from './types';
export type Props<T> = {
    item: ComboBoxItem<T> & {
        deletable?: boolean;
    };
    disabled: boolean;
    onDelete: (item: ComboBoxItem<T>) => void;
    enableEllipsis?: boolean;
    buttonRef: RefObject<HTMLButtonElement>;
    decorators?: {
        destroyButtonIconAlt?: (text: string) => string;
    };
};
export declare function MultiSelectedItem<T>({ item, disabled, onDelete, enableEllipsis, buttonRef, decorators, }: Props<T>): React.JSX.Element;
