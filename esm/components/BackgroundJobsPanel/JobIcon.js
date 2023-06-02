import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { FaCheckCircleIcon, FaCloudDownloadAltIcon, FaExclamationCircleIcon, FaSyncAltIcon, WarningIcon, } from '../Icon';
export const JobIcon = ({ status }) => {
    const Icon = getIcon(status);
    const color = useIconColor(status);
    return React.createElement(Icon, { color: color });
};
function getIcon(status) {
    switch (status) {
        case 'processing':
            return FaSyncAltIcon;
        case 'downloading':
            return FaCloudDownloadAltIcon;
        case 'warning':
            return WarningIcon;
        case 'error':
            return FaExclamationCircleIcon;
        case 'done':
            return FaCheckCircleIcon;
    }
}
function useIconColor(status) {
    const theme = useTheme();
    const { color } = theme;
    switch (status) {
        case 'warning':
            return color.WARNING;
        case 'error':
            return color.DANGER;
        case 'done':
            return color.MAIN;
        default:
            return color.TEXT_BLACK;
    }
}
//# sourceMappingURL=JobIcon.js.map