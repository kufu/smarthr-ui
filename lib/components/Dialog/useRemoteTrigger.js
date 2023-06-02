"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoteTrigger = exports.TRIGGER_EVENT = void 0;
const react_1 = require("react");
exports.TRIGGER_EVENT = 'smarthr-ui:remote-dialog-trigger-dispatch';
function useRemoteTrigger({ onClickClose: orgOnClickClose, id, }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const onClickClose = (0, react_1.useCallback)(() => {
        if (orgOnClickClose) {
            return orgOnClickClose(() => {
                setIsOpen(false);
            });
        }
        setIsOpen(false);
    }, [orgOnClickClose]);
    (0, react_1.useEffect)(() => {
        const handler = ((e) => {
            if (id === e.detail.id) {
                setIsOpen(true);
            }
        });
        document.addEventListener(exports.TRIGGER_EVENT, handler);
        return () => {
            document.removeEventListener(exports.TRIGGER_EVENT, handler);
        };
    }, [id]);
    return {
        isOpen,
        onClickClose,
    };
}
exports.useRemoteTrigger = useRemoteTrigger;
//# sourceMappingURL=useRemoteTrigger.js.map