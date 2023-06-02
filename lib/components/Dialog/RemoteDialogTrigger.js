"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteDialogTrigger = void 0;
const react_1 = require("react");
const useRemoteTrigger_1 = require("./useRemoteTrigger");
const onClickRemoteDialogTrigger = (e) => {
    document.dispatchEvent(new CustomEvent(useRemoteTrigger_1.TRIGGER_EVENT, {
        detail: { id: e.currentTarget.getAttribute('aria-controls') },
    }));
};
const RemoteDialogTrigger = ({ targetId, children, onClick }) => {
    const actualOnClick = (0, react_1.useCallback)((e) => {
        if (onClick) {
            return onClick(() => {
                onClickRemoteDialogTrigger(e);
            });
        }
        onClickRemoteDialogTrigger(e);
    }, [onClick]);
    const actualTrigger = (0, react_1.useMemo)(() => (0, react_1.cloneElement)(children, {
        onClick: actualOnClick,
        'aria-haspopup': 'true',
        'aria-controls': targetId,
    }), [children, targetId, actualOnClick]);
    return actualTrigger;
};
exports.RemoteDialogTrigger = RemoteDialogTrigger;
//# sourceMappingURL=RemoteDialogTrigger.js.map