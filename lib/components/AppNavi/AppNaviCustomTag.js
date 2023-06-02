"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNaviCustomTag = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const appNaviHelper_1 = require("./appNaviHelper");
const useClassNames_1 = require("./useClassNames");
const AppNaviCustomTag = ({ children, tag, icon, current = false, isUnclickable = false, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const iconComponent = (0, appNaviHelper_1.getIconComponent)(theme, { icon, current });
    if (current) {
        if (isUnclickable) {
            const unclickableProps = { href: undefined, disabled: true };
            return (react_1.default.createElement(UnclickableActive, { ...props, ...unclickableProps, as: tag, "$themes": theme, "aria-current": "page", className: classNames.customTag },
                iconComponent,
                children));
        }
        return (react_1.default.createElement(Active, { ...props, as: tag, "$themes": theme, "aria-current": "page", className: classNames.customTag },
            iconComponent,
            children));
    }
    return (react_1.default.createElement(InActive, { ...props, as: tag, "$themes": theme, className: classNames.customTag },
        iconComponent,
        children));
};
exports.AppNaviCustomTag = AppNaviCustomTag;
const Active = styled_components_1.default.div(({ $themes }) => (0, appNaviHelper_1.getItemStyle)({ themes: $themes, isActive: true }));
const InActive = styled_components_1.default.div(({ $themes }) => (0, appNaviHelper_1.getItemStyle)({ themes: $themes }));
const UnclickableActive = styled_components_1.default.div(({ $themes }) => (0, appNaviHelper_1.getItemStyle)({ themes: $themes, isActive: true, isUnclickable: true }));
//# sourceMappingURL=AppNaviCustomTag.js.map