import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { NotificationBar } from './NotificationBar';
export const useClassNames = () => {
    const generate = useClassNameGenerator(NotificationBar.displayName || 'NotificationBar');
    return useMemo(() => ({
        wrapper: generate(),
        actions: generate('actions'),
        closeButton: generate('closeButton'),
        messageArea: generate('messageArea'),
        actionArea: generate('actionArea'),
    }), [generate]);
};
//# sourceMappingURL=useClassNames.js.map