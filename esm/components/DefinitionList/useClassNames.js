import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { DefinitionList } from './DefinitionList';
import { DefinitionListItem } from './DefinitionListItem';
export const useClassNames = () => {
    const generateDefinitionList = useClassNameGenerator(DefinitionList.displayName || 'DefinitionList');
    const generateDefinitionListItem = useClassNameGenerator(DefinitionListItem.displayName || 'DefinitionListItem');
    return useMemo(() => ({
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
//# sourceMappingURL=useClassNames.js.map