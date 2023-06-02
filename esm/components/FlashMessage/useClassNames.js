import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { FlashMessage } from './FlashMessage';
export const useClassNames = () => {
    const generate = useClassNameGenerator(FlashMessage.displayName || 'FlashMessage');
    return useMemo(() => ({
        wrapper: generate(),
        icon: generate('icon'),
        text: generate('text'),
        button: generate('button'),
    }), [generate]);
};
//# sourceMappingURL=useClassNames.js.map