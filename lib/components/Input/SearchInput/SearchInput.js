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
exports.SearchInput = void 0;
const react_1 = __importStar(require("react"));
const Icon_1 = require("../../Icon");
const InputWithTooltip_1 = require("../InputWithTooltip");
const ICON_ALT = '検索';
exports.SearchInput = (0, react_1.forwardRef)(({ decorators, ...props }, ref) => {
    const iconAlt = (0, react_1.useMemo)(() => decorators?.iconAlt?.(ICON_ALT) || ICON_ALT, [decorators]);
    return (react_1.default.createElement("label", null,
        react_1.default.createElement(InputWithTooltip_1.InputWithTooltip, { ...props, ref: ref, prefix: react_1.default.createElement(Icon_1.FaSearchIcon, { alt: iconAlt, color: "TEXT_GREY" }) })));
});
//# sourceMappingURL=SearchInput.js.map