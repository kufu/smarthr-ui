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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmittableJobText = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const Tooltip_1 = require("../Tooltip");
const OmittableJobText = ({ children, className }) => {
    const [needsOmitting, setNeedsOmitting] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        setNeedsOmitting(false);
    }, [children]);
    (0, react_1.useEffect)(() => {
        if (!ref.current || needsOmitting) {
            return;
        }
        const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } = ref.current;
        setNeedsOmitting(offsetWidth < scrollWidth || offsetHeight < scrollHeight);
    }, [needsOmitting, children]);
    return (react_1.default.createElement(Wrapper, { ref: ref, className: className }, needsOmitting ? react_1.default.createElement(StyledTooltip, { message: children }, children) : children));
};
exports.OmittableJobText = OmittableJobText;
const Wrapper = styled_components_1.default.div `
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const StyledTooltip = (0, styled_components_1.default)(Tooltip_1.Tooltip) `
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
`;
//# sourceMappingURL=OmittableJobText.js.map