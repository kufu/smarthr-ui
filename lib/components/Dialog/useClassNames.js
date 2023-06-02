"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const _1 = require(".");
function useClassNames() {
    const generateForDialog = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.Dialog.displayName || 'Dialog');
    const generateForModeless = (0, useClassNameGenerator_1.useClassNameGenerator)(_1.ModelessDialog.displayName || 'ModelessDialog');
    return (0, react_1.useMemo)(() => ({
        dialog: {
            wrapper: generateForDialog('wrapper'),
            dialog: generateForDialog(),
            background: generateForDialog('background'),
            titleArea: generateForDialog('titleArea'),
            title: generateForDialog('title'),
            subtitle: generateForDialog('subtitle'),
            body: generateForDialog('body'),
            description: generateForDialog('description'),
            actionArea: generateForDialog('actionArea'),
            buttonArea: generateForDialog('buttonArea'),
            closeButton: generateForDialog('closeButton'),
            actionButton: generateForDialog('actionButton'),
        },
        modelessDialog: {
            wrapper: generateForModeless(),
            box: generateForModeless('box'),
            header: generateForModeless('header'),
            handle: generateForModeless('handle'),
            closeButton: generateForModeless('closeButton'),
            content: generateForModeless('content'),
            footer: generateForModeless('footer'),
        },
    }), [generateForDialog, generateForModeless]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map