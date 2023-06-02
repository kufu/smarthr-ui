export declare const TRIGGER_EVENT = "smarthr-ui:remote-dialog-trigger-dispatch";
export declare function useRemoteTrigger({ onClickClose: orgOnClickClose, id, }: {
    id: string;
    onClickClose?: (close: () => void) => void;
}): {
    isOpen: boolean;
    onClickClose: () => void;
};
