"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const DefinitionList_1 = require("./DefinitionList");
const DefinitionListItem_1 = require("./DefinitionListItem");
const useClassNames = () => {
    const generateDefinitionList = (0, useClassNameGenerator_1.useClassNameGenerator)(DefinitionList_1.DefinitionList.displayName || 'DefinitionList');
    const generateDefinitionListItem = (0, useClassNameGenerator_1.useClassNameGenerator)(DefinitionListItem_1.DefinitionListItem.displayName || 'DefinitionListItem');
    return (0, react_1.useMemo)(() => ({
        definitionList: {
            wrapper: generateDefinitionList(),
        },
        definitionListItem: {
            wrapper: generateDefinitionListItem(),
            term: generateDefinitionListItem('term'),
            description: generateDefinitionListItem('description'),
        },
    }), [generateDefinitionList, generateDefinitionListItem]);
};
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map