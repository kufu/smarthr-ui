"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const MessageScreen_1 = require("./MessageScreen");
function useClassNames() {
    const generate = (0, useClassNameGenerator_1.useClassNameGenerator)(MessageScreen_1.MessageScreen.displayName || 'MessageScreen');
    return (0, react_1.useMemo)(() => ({
        wrapper: generate(),
        logo: generate('logo'),
        title: generate('title'),
        content: generate('content'),
        linkList: generate('linkList'),
        link: generate('link'),
        footer: generate('footer'),
    }), [generate]);
}
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map