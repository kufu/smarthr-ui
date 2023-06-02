"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const FlashMessage_1 = require("./FlashMessage");
const useClassNames = () => {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(FlashMessage_1.FlashMessage.displayName || 'FlashMessage');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        icon: generate('icon'),
        text: generate('text'),
        button: generate('button'),
    }), [generate]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map