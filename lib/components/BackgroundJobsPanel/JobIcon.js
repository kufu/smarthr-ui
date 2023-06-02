"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobIcon = void 0;
const react_1 = __importDefault(require("react"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const JobIcon = ({ status }) => {
    const Icon = getIcon(status);
    const color = useIconColor(status);
    return react_1.default.createElement(Icon, { color: color });
};
exports.JobIcon = JobIcon;
function getIcon(status) {
    switch (status) {
        case 'processing':
            return Icon_1.FaSyncAltIcon;
        case 'downloading':
            return Icon_1.FaCloudDownloadAltIcon;
        case 'warning':
            return Icon_1.WarningIcon;
        case 'error':
            return Icon_1.FaExclamationCircleIcon;
        case 'done':
            return Icon_1.FaCheckCircleIcon;
    }
}
function useIconColor(status) {
    const theme = (0, useTheme_1.useTheme)();
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