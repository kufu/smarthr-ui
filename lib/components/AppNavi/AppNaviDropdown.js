"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNaviDropdown = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Dropdown_1 = require("../Dropdown");
const Icon_1 = require("../Icon");
const appNaviHelper_1 = require("./appNaviHelper");
const AppNaviDropdown = ({ children, dropdownContent, icon, current = false, isUnclickable = false, displayCaret, }) => {
    const theme = (0, useTheme_1.useTheme)();
    const iconComponent = (0, appNaviHelper_1.getIconComponent)(theme, { icon, current });
    return (react_1.default.createElement(Dropdown_1.Dropdown, null,
        react_1.default.createElement(StyledDropdownTrigger, null,
            react_1.default.createElement(TriggerButton, { themes: theme, "aria-current": current ? 'page' : undefined, isActive: current, disabled: isUnclickable, isUnclickable: isUnclickable, type: "button", displayCaret: displayCaret },
                iconComponent,
                children,
                displayCaret && react_1.default.createElement(Icon_1.FaCaretDownIcon, null))),
        react_1.default.createElement(Dropdown_1.DropdownContent, null, dropdownContent)));
};
exports.AppNaviDropdown = AppNaviDropdown;
const StyledDropdownTrigger = (0, styled_components_1.default)(Dropdown_1.DropdownTrigger) `
  height: 100%;
`;
const TriggerButton = styled_components_1.default.button(({ displayCaret, ...props }) => (0, styled_components_1.css) `
    ${(0, appNaviHelper_1.getItemStyle)(props)}

    ${displayCaret &&
    (0, styled_components_1.css) `
      &[aria-expanded='true'] {
        .smarthr-ui-Icon:last-child {
          transform: rotate(0.5turn);
        }
      }
    `}
  `);
//# sourceMappingURL=AppNaviDropdown.js.map