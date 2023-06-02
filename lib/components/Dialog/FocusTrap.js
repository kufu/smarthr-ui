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
exports.FocusTrap = void 0;
const react_1 = __importStar(require("react"));
const tabbable_1 = require("../../libs/tabbable");
const FocusTrap = ({ firstFocusTarget, children }) => {
    const ref = (0, react_1.useRef)(null);
    const dummyFocusRef = (0, react_1.useRef)(null);
    const handleKeyDown = (0, react_1.useCallback)((e) => {
        if (e.key !== 'Tab' || ref.current === null) {
            return;
        }
        const tabbables = (0, tabbable_1.tabbable)(ref.current).filter((elm) => elm.tabIndex >= 0);
        if (tabbables.length === 0) {
            return;
        }
        const firstTabbale = tabbables[0];
        const lastTabbale = tabbables[tabbables.length - 1];
        const currentFocused = Array.from(tabbables).find((elm) => elm === e.target);
        if (e.shiftKey &&
            (currentFocused === firstTabbale || document.activeElement === dummyFocusRef.current)) {
            lastTabbale.focus();
            e.preventDefault();
        }
        else if (!e.shiftKey && currentFocused === lastTabbale) {
            firstTabbale.focus();
            e.preventDefault();
        }
    }, []);
    (0, react_1.useEffect)(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);
    (0, react_1.useEffect)(() => {
        const triggerElement = document.activeElement;
        if (firstFocusTarget?.current) {
            firstFocusTarget.current.focus();
        }
        else {
            dummyFocusRef.current?.focus();
        }
        return () => {
            // フォーカストラップ終了時にトリガにフォーカスを戻す
            if (triggerElement instanceof HTMLElement) {
                triggerElement.focus();
            }
        };
    }, [firstFocusTarget]);
    return (react_1.default.createElement("div", { ref: ref },
        react_1.default.createElement("div", { ref: dummyFocusRef, tabIndex: -1 }),
        children));
};
exports.FocusTrap = FocusTrap;
//# sourceMappingURL=FocusTrap.js.map