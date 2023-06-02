import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { MessageScreen } from './MessageScreen';
export function useClassNames() {
    const generate = useClassNameGenerator(MessageScreen.displayName || 'MessageScreen');
    return useMemo(() => ({
        wrapper: generate(),
        logo: generate('logo'),
        title: generate('title'),
        content: generate('content'),
        linkList: generate('linkList'),
        link: generate('link'),
        footer: generate('footer'),
    }), [generate]);
}
//# sourceMappingURL=useClassNames.js.map