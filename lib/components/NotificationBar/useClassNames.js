"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const NotificationBar_1 = require("./NotificationBar");
const useClassNames = () => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(NotificationBar_1.NotificationBar.displayName || 'NotificationBar');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        actions: generate('actions'),
        closeButton: generate('closeButton'),
        messageArea: generate('messageArea'),
        actionArea: generate('actionArea'),
    }), [generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map