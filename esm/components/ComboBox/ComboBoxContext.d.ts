/// <reference types="react" />
type ComboBoxContextType = {
    listBoxClassNames: {
        dropdownList: string;
        addButton: string;
        selectButton: string;
        noItems: string;
    };
};
export declare const ComboBoxContext: import("react").Context<ComboBoxContextType>;
export {};
