import { useMemo } from 'react';
import { useClassNameGenerator } from '../../hooks/useClassNameGenerator';
import { BackgroundJobsList } from './BackgroundJobsList';
import { BackgroundJobsPanel } from './BackgroundJobsPanel';
export const useClassNames = () => {
    const generateBackgroundJobsList = useClassNameGenerator(BackgroundJobsList.displayName || 'BackgroundJobsList');
    const generateBackgroundJobsPanel = useClassNameGenerator(BackgroundJobsPanel.displayName || 'BackgroundJobsPanel');
    return useMemo(() => ({
        backgroundJobsList: {
            wrapper: generateBackgroundJobsList(),
        },
        backgroundJobsPanel: {
            wrapper: generateBackgroundJobsPanel(),
            title: generateBackgroundJobsPanel('title'),
            toggleButton: generateBackgroundJobsPanel('toggle-button'),
            closeButton: generateBackgroundJobsPanel('close-button'),
            list: generateBackgroundJobsPanel('list'),
            listItem: generateBackgroundJobsPanel('list-item'),
        },
    }), [generateBackgroundJobsList, generateBackgroundJobsPanel]);
};
//# sourceMappingURL=useClassNames.js.map