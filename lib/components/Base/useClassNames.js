"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const Base_1 = require("./Base");
const DialogBase_1 = require("./DialogBase");
const useClassNames = () => {
    const generateBase = (0, useClassNameGenerator_1.useClassNameGenerator)(Base_1.Base.displayName || 'Base');
    const generateDialogBase = (0, useClassNameGenerator_1.useClassNameGenerator)(DialogBase_1.DialogBase.displayName || 'DialogBase');
    return (0, react_1.useMemo)(() => ({
        base: {
            wrapper: generateBase(),
        },
        dialogBase: {
            wrapper: generateDialogBase(),
        },
    }), [generateBase, generateDialogBase]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map