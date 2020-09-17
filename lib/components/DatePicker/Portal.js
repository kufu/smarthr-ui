"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = void 0;
var react_1 = __importStar(require("react"));
var react_dom_1 = require("react-dom");
var styled_components_1 = __importStar(require("styled-components"));
exports.Portal = function (_a) {
    var top = _a.top, left = _a.left, children = _a.children;
    var root = react_1.useRef(document.createElement('div')).current;
    react_1.useEffect(function () {
        document.body.appendChild(root);
        return function () {
            document.body.removeChild(root);
        };
    }, [root]);
    return react_dom_1.createPortal(react_1.default.createElement(Container, { top: top, left: left }, children), root);
};
var Container = styled_components_1.default.div(function (_a) {
    var top = _a.top, left = _a.left;
    return styled_components_1.css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n  "], ["\n    position: absolute;\n    top: ", "px;\n    left: ", "px;\n  "])), top, left);
});
var templateObject_1;
//# sourceMappingURL=Portal.js.map