"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropdownScrollArea = void 0;
var react_1 = __importDefault(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
exports.DropdownScrollArea = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (react_1.default.createElement(Wrapper, { className: className }, children));
};
var Wrapper = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  overflow-y: auto;\n  flex: 1 1 auto;\n\n  /* IE11 */\n  /* stylelint-disable-next-line selector-type-no-unknown */\n  _:-ms-lang(x)::-ms-backdrop,\n  & {\n    max-height: 300px;\n  }\n"], ["\n  overflow-y: auto;\n  flex: 1 1 auto;\n\n  /* IE11 */\n  /* stylelint-disable-next-line selector-type-no-unknown */\n  _:-ms-lang(x)::-ms-backdrop,\n  & {\n    max-height: 300px;\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=DropdownScrollArea.js.map