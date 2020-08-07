"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNaviDropdown = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var Dropdown_1 = require("../Dropdown");
var appNaviHelper_1 = require("./appNaviHelper");
exports.AppNaviDropdown = function (_a) {
    var children = _a.children, dropdownContent = _a.dropdownContent, icon = _a.icon, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.isUnclickable, isUnclickable = _c === void 0 ? false : _c;
    var theme = useTheme_1.useTheme();
    var iconComponent = appNaviHelper_1.getIconComponent(theme, { icon: icon, current: current });
    return (react_1.default.createElement(Dropdown_1.Dropdown, null,
        react_1.default.createElement(Dropdown_1.DropdownTrigger, null,
            react_1.default.createElement(TriggerButton, { themes: theme, "aria-current": current ? 'page' : undefined, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable },
                iconComponent,
                children)),
        react_1.default.createElement(Dropdown_1.DropdownContent, null, dropdownContent)));
};
var TriggerButton = styled_components_1.default.button(function (props) { return appNaviHelper_1.getItemStyle(props); });
//# sourceMappingURL=AppNaviDropdown.js.map