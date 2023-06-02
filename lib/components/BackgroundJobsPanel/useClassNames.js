"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useClassNames = void 0;
const react_1 = require("react");
const useClassNameGenerator_1 = require("../../hooks/useClassNameGenerator");
const BackgroundJobsList_1 = require("./BackgroundJobsList");
const BackgroundJobsPanel_1 = require("./BackgroundJobsPanel");
const useClassNames = () => {
    const generateBackgroundJobsList = (0, useClassNameGenerator_1.useClassNameGenerator)(BackgroundJobsList_1.BackgroundJobsList.displayName || 'BackgroundJobsList');
    const generateBackgroundJobsPanel = (0, useClassNameGenerator_1.useClassNameGenerator)(BackgroundJobsPanel_1.BackgroundJobsPanel.displayName || 'BackgroundJobsPanel');
    return (0, react_1.useMemo)(() => ({
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
exports.useClassNames = useClassNames;
//# sourceMappingURL=useClassNames.js.map