"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNaviAnchor = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const appNaviHelper_1 = require("./appNaviHelper");
const useClassNames_1 = require("./useClassNames");
const AppNaviAnchor = ({ children, href, icon, current = false, isUnclickable = false, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const iconComponent = (0, appNaviHelper_1.getIconComponent)(theme, { icon, current });
    return (react_1.default.createElement(Anchor, { themes: theme, "aria-current": current ? 'page' : undefined, href: isUnclickable ? undefined : href, isActive: current, isUnclickable: isUnclickable, className: classNames.anchor },
        iconComponent,
        children));
};
exports.AppNaviAnchor = AppNaviAnchor;
const Anchor = styled_components_1.default.a((props) => (0, appNaviHelper_1.getItemStyle)(props));
//# sourceMappingURL=AppNaviAnchor.js.map