"use strict";
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
exports.AppNaviCustomTag = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var useTheme_1 = require("../../hooks/useTheme");
var appNaviHelper_1 = require("./appNaviHelper");
exports.AppNaviCustomTag = function (_a) {
    var children = _a.children, tag = _a.tag, icon = _a.icon, _b = _a.current, current = _b === void 0 ? false : _b, _c = _a.isUnclickable, isUnclickable = _c === void 0 ? false : _c, props = __rest(_a, ["children", "tag", "icon", "current", "isUnclickable"]);
    var theme = useTheme_1.useTheme();
    var iconComponent = appNaviHelper_1.getIconComponent(theme, { icon: icon, current: current });
    if (current) {
        if (isUnclickable) {
            var unclickableProps = { href: undefined, disabled: true };
            return (react_1.default.createElement(UnclickableActive, __assign({ as: tag, themes: theme, "aria-current": "page" }, props, unclickableProps),
                iconComponent,
                children));
        }
        return (react_1.default.createElement(Active, __assign({ as: tag, themes: theme, "aria-current": "page" }, props),
            iconComponent,
            children));
    }
    return (react_1.default.createElement(InActive, __assign({ as: tag, themes: theme }, props),
        iconComponent,
        children));
};
var Active = styled_components_1.default.div(function (_a) {
    var themes = _a.themes;
    return appNaviHelper_1.getItemStyle({ themes: themes, isActive: true });
});
var InActive = styled_components_1.default.div(function (_a) {
    var themes = _a.themes;
    return appNaviHelper_1.getItemStyle({ themes: themes });
});
var UnclickableActive = styled_components_1.default.div(function (_a) {
    var themes = _a.themes;
    return appNaviHelper_1.getItemStyle({ themes: themes, isActive: true, isUnclickable: true });
});
//# sourceMappingURL=AppNaviCustomTag.js.map