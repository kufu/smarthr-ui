import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { Base } from './Base';
import { DialogBase } from './DialogBase';
export const useClassNames = () => {
    const generateBase = useClassNameGenerator(Base.displayName || 'Base');
    const generateDialogBase = useClassNameGenerator(DialogBase.displayName || 'DialogBase');
    return useMemo(() => ({
        base: {
            wrapper: generateBase(),
        },
        dialogBase: {
            wrapper: generateDialogBase(),
        },
    }), [generateBase, generateDialogBase]);
};
//# sourceMappingURL=useClassNames.js.map