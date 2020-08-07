"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNaviAnchor = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var appNaviHelper_1 = require("./appNaviHelper");
exports.AppNaviAnchor = function (_a) {
    var children = _a.children, href = _a.href, icon = _a.icon, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.isUnclickable, isUnclickable = _c === void 0 ? false : _c;
    var theme = useTheme_1.useTheme();
    var iconComponent = appNaviHelper_1.getIconComponent(theme, { icon: icon, current: current });
    return (react_1.default.createElement(Anchor, { themes: theme, "aria-current": current ? 'page' : undefined, href: isUnclickable ? undefined : href, isActive: current, isUnclickable: isUnclickable },
        iconComponent,
        children));
};
var Anchor = styled_components_1.default.a(function (props) { return appNaviHelper_1.getItemStyle(props); });
//# sourceMappingURL=AppNaviAnchor.js.map