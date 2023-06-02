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
exports.LineClamp = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const Tooltip_1 = require("../Tooltip");
const useClassNames_1 = require("./useClassNames");
const LineClamp = ({ maxLines = 3, withTooltip = false, children, className = '', ...props }) => {
    const classNames = (0, useClassNames_1.useClassNames)();
    const [isTooltipVisible, setTooltipVisible] = (0, react_1.useState)(false);
    const ref = (0, react_1.useRef)(null);
    const isMultiLineOverflow = () => {
        const el = ref.current;
        return el ? el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight : false;
    };
    (0, react_1.useEffect)(() => {
        setTooltipVisible(withTooltip && isMultiLineOverflow());
    }, [maxLines, withTooltip, children]);
    if (maxLines < 1) {
        throw new Error('"maxLines" cannot be less than 0.');
    }
    const LineClampPart = () => (react_1.default.createElement(Wrapper, { ...props, ref: ref, maxLines: maxLines, className: `${className} ${classNames.wrapper}` }, children));
    return isTooltipVisible ? (react_1.default.createElement(Tooltip_1.Tooltip, { message: children, multiLine: true, vertical: "auto" },
        react_1.default.createElement(LineClampPart, null))) : (react_1.default.createElement(LineClampPart, null));
};
exports.LineClamp = LineClamp;
const Wrapper = styled_components_1.default.span `
  word-break: break-word;
  ${({ maxLines }) => maxLines === 1
    ? (0, styled_components_1.css) `
          display: inline-block;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
        `
    : (0, styled_components_1.css) `
          /* stylelint-disable */
          display: box;
          display: -webkit-box;
          display: -moz-box;
          box-orient: vertical;
          -webkit-box-orient: vertical;
          -moz-box-orient: vertical;
          line-clamp: ${maxLines};
          -webkit-line-clamp: ${maxLines};
          /* stylelint-enable */
          overflow-y: hidden;

          /* inline-block に overflow: visible 以外を指定すると、vertical-align が bottom margin edge に揃ってしまう
           * https://ja.stackoverflow.com/questions/2603/ */
          vertical-align: bottom;
        `}
`;
//# sourceMappingURL=LineClamp.js.map