"use strict";
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
exports.DialogPositionProvider = exports.PositionContext = void 0;
var react_1 = __importStar(require("react"));
exports.PositionContext = react_1.createContext({});
exports.DialogPositionProvider = function (_a) {
    var top = _a.top, bottom = _a.bottom, children = _a.children;
    return (react_1.default.createElement(exports.PositionContext.Provider, { value: {
            top: top,
            bottom: bottom,
        } }, children));
};
//# sourceMappingURL=DialogPositionProvider.js.map