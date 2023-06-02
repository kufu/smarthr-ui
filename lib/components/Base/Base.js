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
exports.Base = exports.layerMap = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useSpacing_1 = require("../../hooks/useSpacing");
const useTheme_1 = require("../../hooks/useTheme");
const useClassNames_1 = require("./useClassNames");
exports.layerMap = {
    0: 'LAYER0',
    1: 'LAYER1',
    2: 'LAYER2',
    3: 'LAYER3',
    4: 'LAYER4',
};
const separatePadding = (padding) => {
    if (padding instanceof Object) {
        return {
            block: padding.block,
            inline: padding.inline,
        };
    }
    return {
        block: padding,
        inline: padding,
    };
};
exports.Base = (0, react_1.forwardRef)(({ padding, radius = 'm', overflow, layer = 1, className = '', ...props }, ref) => {
    const themes = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const $padding = separatePadding(padding);
    const $radius = (0, react_1.useMemo)(() => {
        switch (radius) {
            case 's':
                return themes.radius.m;
            case 'm':
                return themes.radius.l;
        }
    }, [radius, themes.radius.l, themes.radius.m]);
    return (react_1.default.createElement(Wrapper, { ...props, className: `${className} ${classNames.base.wrapper}`, themes: themes, "$padding": $padding, "$radius": $radius, "$overflow": overflow, "$layer": exports.layerMap[layer], ref: ref }));
});
const Wrapper = styled_components_1.default.div `
  ${({ themes: { border, color, shadow }, $padding, $radius, $overflow, $layer }) => (0, styled_components_1.css) `
    box-shadow: ${shadow[$layer]};
    border-radius: ${$radius};
    background-color: ${color.WHITE};
    @media (prefers-contrast: more) {
      & {
        border: ${border.highContrast};
      }
    }

    ${$padding.block && `padding-block: ${(0, useSpacing_1.useSpacing)($padding.block)};`}
    ${$padding.inline && `padding-inline: ${(0, useSpacing_1.useSpacing)($padding.inline)};`}
    ${$overflow &&
    ($overflow instanceof Object
        ? (0, styled_components_1.css) `
          overflow-x: ${$overflow.x};
          overflow-y: ${$overflow.y};
        `
        : (0, styled_components_1.css) `
          overflow: ${$overflow};
        `)}
  `}
`;
//# sourceMappingURL=Base.js.map