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
exports.BaseButtonAnchor = exports.BaseButton = exports.buttonFactory = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const hoverable_1 = require("../../hocs/hoverable");
const useTheme_1 = require("../../hooks/useTheme");
const buttonFactory = (tag) => {
    const BaseTag = (0, hoverable_1.hoverable)()(tagStore[tag]);
    const Button = ({ size = 'default', className = '', square = false, children = '', prefix = '', suffix = '', ...props }) => {
        const theme = (0, useTheme_1.useTheme)();
        // prettier-ignore
        const classNames = `${size} ${className} ${square ? 'square' : ''} ${prefix ? 'prefix' : ''} ${suffix ? 'suffix' : ''}`;
        return (react_1.default.createElement(BaseTag, { ...props, className: classNames, themes: theme },
            prefix,
            react_1.default.createElement(TextLabel, null, children),
            suffix));
    };
    return Button;
};
exports.buttonFactory = buttonFactory;
const Base = styled_components_1.default.div `
  ${({ themes, wide }) => {
    const { border, fontSize, leading, radius, shadow, spacingByChar } = themes;
    return (0, styled_components_1.css) `
      box-sizing: border-box;
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: ${spacingByChar(0.5)};
      text-align: center;
      white-space: nowrap;
      border-radius: ${radius.m};

      /* ボタンの高さを合わせるために指定 */
      border: ${border.lineWidth} ${border.lineStyle} transparent;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      font-family: inherit;
      font-size: ${fontSize.M};
      font-weight: bold;
      line-height: ${leading.NONE};
      ${wide && 'width: 100%;'}

      &.square {
        padding: ${spacingByChar(0.75)};
      }

      &.s {
        padding: ${spacingByChar(0.5)};
        font-size: ${fontSize.S};

        /* ボタンラベルの line-height を 0 にしたため、高さを担保する */
        min-height: calc(${fontSize.S} + ${spacingByChar(1)} + (${border.lineWidth} * 2));
      }

      &[disabled] {
        cursor: not-allowed;

        /* alpha color を使用しているので、背景色と干渉させない */
        background-clip: padding-box;
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }

      /* baseline より下の leading などの余白を埋める */
      .smarthr-ui-Icon,
      svg {
        display: block;
      }
    `;
}}
`;
const TextLabel = styled_components_1.default.span `
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`;
const tagStore = {
    button: Base.withComponent('button'),
    a: Base.withComponent('a'),
};
exports.BaseButton = (0, exports.buttonFactory)('button');
const ButtonAnchor = (0, exports.buttonFactory)('a');
exports.BaseButtonAnchor = (0, styled_components_1.default)(ButtonAnchor) `
  text-decoration: none;

  &:not([href]) {
    cursor: not-allowed;

    /* alpha color を使用しているので、背景色と干渉させない */
    background-clip: padding-box;
  }
`;
//# sourceMappingURL=BaseButton.js.map