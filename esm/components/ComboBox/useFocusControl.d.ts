/// <reference types="react" />
export declare function useFocusControl(selectedItemLength: number): {
    deletionButtonRefs: import("react").RefObject<HTMLButtonElement>[];
    inputRef: import("react").RefObject<HTMLInputElement>;
    focusPrevDeletionButton: () => void;
    focusNextDeletionButton: () => void;
    resetDeletionButtonFocus: () => void;
};
