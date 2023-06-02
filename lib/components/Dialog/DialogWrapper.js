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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogWrapper = exports.DialogContext = void 0;
const react_1 = __importStar(require("react"));
exports.DialogContext = (0, react_1.createContext)({
    onClickTrigger: () => {
        /* noop */
    },
    onClickClose: () => {
        /* noop */
    },
    active: false,
});
const DialogWrapper = ({ children }) => {
    const [active, setActive] = (0, react_1.useState)(false);
    return (react_1.default.createElement(exports.DialogContext.Provider, { value: {
            onClickTrigger: () => setActive(true),
            onClickClose: () => setActive(false),
            active,
        } }, children));
};
exports.DialogWrapper = DialogWrapper;
//# sourceMappingURL=DialogWrapper.js.map