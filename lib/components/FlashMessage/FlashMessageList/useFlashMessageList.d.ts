/// <reference types="react" />
/**
 * @deprecated `FlashMessage` は気づきにくいため、安易な使用はお勧めしません。`NotificationBar` や `Dialog` の使用を検討してください。
 */
export declare function useFlashMessageList(): {
    enqueueMessage: (message: {
        type: "error" | "success" | "warning" | "info";
        animation?: "none" | "bounce" | "fade" | undefined;
        text: import("react").ReactNode;
        className?: string | undefined;
        role?: "status" | "alert" | undefined;
        autoClose?: boolean | undefined;
    }) => void;
};
