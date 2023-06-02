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
exports.RadioButtonPanel = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Base_1 = require("../Base");
const RadioButton_1 = require("../RadioButton");
const useClassNames_1 = require("./useClassNames");
const RadioButtonPanel = ({ onClick, as, className, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)(className);
    // 外側の装飾を押しても内側のラジオボタンが押せるようにする
    const innerRef = (0, react_1.useRef)(null);
    const handleOuterClick = () => {
        innerRef.current?.click();
    };
    return (react_1.default.createElement(Wrapper, { onClick: handleOuterClick, forwardedAs: as, themes: theme, className: classNames.wrapper },
        react_1.default.createElement(RadioButton_1.RadioButton, { ...props, ref: innerRef })));
};
exports.RadioButtonPanel = RadioButtonPanel;
const Wrapper = (0, styled_components_1.default)(Base_1.Base).attrs({ padding: 1 }) `
  ${({ themes: { shadow, space } }) => (0, styled_components_1.css) `
    :not(:has([disabled])) {
      cursor: pointer;
    }

    /* :focus-visible-within の代替 */
    :has(:focus-visible) {
      ${shadow.focusIndicatorStyles}
    }

    .smarthr-ui-RadioButton-radioButton:focus + span {
      box-shadow: revert;
    }

    .smarthr-ui-RadioButton-label {
      /* 視覚的な調整 */
      margin-inline-start: ${space(0.75)};
    }
  `}
`;
//# sourceMappingURL=RadioButtonPanel.js.map