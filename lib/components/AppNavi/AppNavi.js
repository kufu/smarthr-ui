"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppNavi = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var StatusLabel_1 = require("../StatusLabel/StatusLabel");
var AppNaviButton_1 = require("./AppNaviButton");
var AppNaviAnchor_1 = require("./AppNaviAnchor");
var AppNaviDropdown_1 = require("./AppNaviDropdown");
var AppNaviCustomTag_1 = require("./AppNaviCustomTag");
exports.AppNavi = function (_a) {
    var label = _a.label, buttons = _a.buttons, isCurrentUnclickable = _a.isCurrentUnclickable, _b = _a.children, children = _b === void 0 ? null : _b;
    var theme = useTheme_1.useTheme();
    return (react_1.default.createElement(Wrapper, { themes: theme },
        label && react_1.default.createElement(StatusLabel, { themes: theme }, label),
        buttons && (react_1.default.createElement(Buttons, { themes: theme }, buttons.map(function (button, i) {
            var isUnclickable = button.current && isCurrentUnclickable;
            if ('href' in button) {
                return (react_1.default.createElement("li", { key: i },
                    react_1.default.createElement(AppNaviAnchor_1.AppNaviAnchor, { href: button.href, icon: button.icon, current: button.current, isUnclickable: isUnclickable }, button.children)));
            }
            if ('dropdownContent' in button) {
                return (react_1.default.createElement("li", { key: i },
                    react_1.default.createElement(AppNaviDropdown_1.AppNaviDropdown, { dropdownContent: button.dropdownContent, icon: button.icon, current: button.current, isUnclickable: isUnclickable }, button.children)));
            }
            if ('tag' in button) {
                var tag = button.tag, icon = button.icon, current = button.current, buttonChildren = button.children, props = __rest(button, ["tag", "icon", "current", "children"]);
                return (react_1.default.createElement("li", { key: i },
                    react_1.default.createElement(AppNaviCustomTag_1.AppNaviCustomTag, __assign({ tag: tag, icon: icon, current: current, isUnclickable: isUnclickable }, props), buttonChildren)));
            }
            return (react_1.default.createElement("li", { key: i },
                react_1.default.createElement(AppNaviButton_1.AppNaviButton, { icon: button.icon, current: button.current, onClick: button.onClick, isUnclickable: isUnclickable }, button.children)));
        }))),
        children));
};
var Wrapper = styled_components_1.default.nav(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var pxToRem = themes.size.pxToRem;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      height: 40px;\n      padding: 0 ", ";\n      background-color: #fff;\n      box-sizing: border-box;\n      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);\n    "], ["\n      display: flex;\n      align-items: center;\n      width: 100%;\n      height: 40px;\n      padding: 0 ", ";\n      background-color: #fff;\n      box-sizing: border-box;\n      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);\n    "])), pxToRem(20));
});
var StatusLabel = styled_components_1.default(StatusLabel_1.StatusLabel)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n      margin-right: ", ";\n    "], ["\n      margin-right: ", ";\n    "])), pxToRem(space.XS));
});
var Buttons = styled_components_1.default.ul(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  ", "\n"], ["\n  ",
    "\n"])), function (_a) {
    var themes = _a.themes;
    var _b = themes.size, pxToRem = _b.pxToRem, space = _b.space;
    return styled_components_1.css(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n      display: flex;\n      align-items: center;\n      margin: 0;\n      padding: 0;\n\n      > li {\n        list-style: none;\n\n        &:not(:first-child) {\n          margin-left: ", ";\n        }\n      }\n    "], ["\n      display: flex;\n      align-items: center;\n      margin: 0;\n      padding: 0;\n\n      > li {\n        list-style: none;\n\n        &:not(:first-child) {\n          margin-left: ", ";\n        }\n      }\n    "])), pxToRem(space.XS));
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6;
//# sourceMappingURL=AppNavi.js.map