/// <reference types="react" />
import { ComboBoxOption } from './types';
export declare function useActiveOption<T>({ options }: {
    options: Array<ComboBoxOption<T>>;
}): {
    activeOption: ComboBoxOption<T> | null;
    setActiveOption: import("react").Dispatch<import("react").SetStateAction<ComboBoxOption<T> | null>>;
    moveActivePositionDown: () => void;
    moveActivePositionUp: () => void;
};
