"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const InputFile_1 = require("./InputFile");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(InputFile_1.InputFile.displayName || 'InputFile');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        input: generate('input'),
        button: generate('button'),
        fileList: generate('fileList'),
        fileName: generate('fileName'),
        deleteButton: generate('deleteButton'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map