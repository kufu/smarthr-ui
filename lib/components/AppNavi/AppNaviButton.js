"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNaviButton = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Button_1 = require("../Button");
const appNaviHelper_1 = require("./appNaviHelper");
const useClassNames_1 = require("./useClassNames");
const AppNaviButton = ({ children, icon, current = false, isUnclickable = false, onClick, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const iconComponent = (0, appNaviHelper_1.getIconComponent)(theme, { icon, current });
    return (react_1.default.createElement(Button, { themes: theme, "aria-current": current ? 'page' : undefined, onClick: onClick, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable, type: "button", className: classNames.button },
        iconComponent,
        children));
};
exports.AppNaviButton = AppNaviButton;
const Button = (0, styled_components_1.default)(Button_1.UnstyledButton)((props) => (0, appNaviHelper_1.getItemStyle)(props));
//# sourceMappingURL=AppNaviButton.js.map