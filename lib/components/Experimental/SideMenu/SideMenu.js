"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideMenu = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Layout_1 = require("../../Layout");
const SideMenuGroup_1 = require("./SideMenuGroup");
const SideMenuItem_1 = require("./SideMenuItem");
const useClassNames_1 = require("./useClassNames");
const SideMenu = ({ children, className, ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)();
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className || ''} ${classNames.wrapper}` }, children));
};
exports.SideMenu = SideMenu;
exports.SideMenu.Group = SideMenuGroup_1.SideMenuGroup;
exports.SideMenu.Item = SideMenuItem_1.SideMenuItem;
const Wrapper = (0, styled_components_1.default)(Layout_1.Stack).attrs({ as: 'ul', inline: true, gap: 0.75 }) ``;
//# sourceMappingURL=SideMenu.js.map