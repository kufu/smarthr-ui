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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooltipPortal = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importStar(require("styled-components"));
var tooltipHelper_1 = require("./tooltipHelper");
exports.TooltipPortal = function (_a) {
    var id = _a.id, parentRect = _a.parentRect, children = _a.children, _b = _a.isIcon, isIcon = _b === void 0 ? false : _b, _c = _a.isMultiLine, isMultiLine = _c === void 0 ? false : _c, horizontal = _a.horizontal, vertical = _a.vertical;
    var portalRef = react_1.useRef(null);
    var _d = react_1.useState({
        top: 0,
        left: 0,
        width: isMultiLine ? parentRect.width : 0,
        height: 0,
    }), rect = _d[0], setRect = _d[1];
    react_1.useLayoutEffect(function () {
        if (!portalRef.current) {
            return;
        }
        var _a = portalRef.current, offsetWidth = _a.offsetWidth, offsetHeight = _a.offsetHeight;
        setRect(tooltipHelper_1.getTooltipRect({
            parentRect: parentRect,
            tooltipSize: {
                width: offsetWidth,
                height: offsetHeight,
            },
            vertical: vertical,
            horizontal: horizontal,
            isMultiLine: isMultiLine,
            isIcon: isIcon,
            outerMargin: 10,
        }));
    }, [horizontal, isIcon, isMultiLine, parentRect, vertical]);
    return (react_1.default.createElement(Container, __assign({ id: id, ref: portalRef }, rect), children));
};
var Container = styled_components_1.default.div(function (_a) {
    var top = _a.top, left = _a.left, width = _a.width, height = _a.height;
    return styled_components_1.css(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n    ", "\n    ", "\n    z-index: 9000;\n  "], ["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n    ",
        "\n    ",
        "\n    z-index: 9000;\n  "])), top, left, width > 0 && styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n      width: ", "px;\n    "], ["\n      width: ", "px;\n    "])), width), height > 0 && styled_components_1.css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n      height: ", "px;\n    "], ["\n      height: ", "px;\n    "])), height));
});
var templateObject_1, templateObject_2, templateObject_3;
//# sourceMappingURL=TooltipPortal.js.map