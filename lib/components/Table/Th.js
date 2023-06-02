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
exports.Th = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const Icon_1 = require("../Icon");
const VisuallyHiddenText_1 = require("../VisuallyHiddenText");
const useClassNames_1 = require("./useClassNames");
const useReelShadow_1 = require("./useReelShadow");
const SORT_DIRECTION_LABEL = {
    asc: '昇順',
    desc: '降順',
    none: '並び替えなし',
};
const Th = ({ children, sort, onSort, decorators, fixed = false, className = '', ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useThClassNames)();
    const wrapperClass = [className, classNames.wrapper].filter((c) => !!c).join(' ');
    const sortLabel = (0, react_1.useMemo)(() => sort &&
        (decorators?.sortDirectionIconAlt?.(SORT_DIRECTION_LABEL[sort], { sort }) ||
            SORT_DIRECTION_LABEL[sort]), [decorators, sort]);
    const ariaSortProps = (0, react_1.useMemo)(() => {
        return (sort && {
            'aria-sort': sort === 'none' ? 'none' : `${sort}ending`,
        });
    }, [sort]);
    return (react_1.default.createElement(Wrapper, { ...ariaSortProps, ...props, className: `${wrapperClass} ${fixed ? 'fixedElement' : ''}`, themes: theme, fixed: fixed }, sort ? (react_1.default.createElement(SortButton, { themes: theme, onClick: onSort },
        children,
        react_1.default.createElement(SortIcon, { sort: sort }),
        react_1.default.createElement(VisuallyHiddenText_1.VisuallyHiddenText, null, sortLabel))) : (children)));
};
exports.Th = Th;
const Wrapper = styled_components_1.default.th `
  ${({ themes: { fontSize, leading, color, shadow, space }, fixed }) => (0, styled_components_1.css) `
    font-size: ${fontSize.S};
    font-weight: bold;
    padding: ${space(0.75)} ${space(1)};
    text-align: left;
    color: ${color.TEXT_BLACK};
    line-height: ${leading.TIGHT};
    vertical-align: middle;

    &[aria-sort] {
      cursor: pointer;

      &:hover {
        background-color: ${color.hoverColor(color.HEAD)};
      }

      /* :focus-visible-within の代替 */
      &:has(:focus-visible) {
        ${shadow.focusIndicatorStyles}
      }
    }

    /* これ以降の記述はTableReel内で'fixed'を利用した際に追従させるために必要 */
    &.fixedElement {
      ${(0, useReelShadow_1.useReelShadow)({ showShadow: false, direction: 'right' })}
    }

    ${fixed &&
    (0, styled_components_1.css) `
      &.fixed {
        position: sticky;
        right: 0;

        &::after {
          opacity: 1;
        }
      }
    `}
  `}
`;
const SortButton = styled_components_1.default.button `
  ${({ themes: { fontSize, space } }) => (0, styled_components_1.css) `
    cursor: pointer;
    box-sizing: content-box;
    display: inline-flex;
    align-items: center;
    column-gap: ${space(0.5)};
    justify-content: space-between;
    margin: ${space(-0.75)} ${space(-1)};
    border: unset;
    outline: unset;
    background-color: unset;
    padding: ${space(0.75)} ${space(1)};
    width: 100%;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;

    .smarthr-ui-Icon {
      font-size: ${fontSize.M};
    }
  `}
`;
const SortIcon = ({ sort }) => (react_1.default.createElement(SortIconWraper, null,
    react_1.default.createElement(Icon_1.FaSortUpIcon, { color: sort === 'asc' ? 'TEXT_BLACK' : 'TEXT_DISABLED' }),
    react_1.default.createElement(Icon_1.FaSortDownIcon, { color: sort === 'desc' ? 'TEXT_BLACK' : 'TEXT_DISABLED' })));
const SortIconWraper = styled_components_1.default.span `
  display: inline-flex;
  flex-direction: column;

  .smarthr-ui-Icon + .smarthr-ui-Icon {
    margin-top: -1em;
  }
`;
//# sourceMappingURL=Th.js.map