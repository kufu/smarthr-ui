"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonInner = void 0;
const react_1 = __importDefault(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const ButtonInner = ({ prefix, suffix, children }) => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        prefix,
        react_1.default.createElement(TextLabel, null, children),
        suffix));
};
exports.ButtonInner = ButtonInner;
const TextLabel = styled_components_1.default.span `
  /* LineClamp を併用する場合に、幅を計算してもらうために指定 */
  min-width: 0;

  .s & {
    /* FIXME! SVG とテキストコンテンツの縦位置が揃わないので暫定対応 */
    line-height: 0;
  }
`;
//# sourceMappingURL=ButtonInner.js.map