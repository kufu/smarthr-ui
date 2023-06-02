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
exports.AccordionPanelTrigger = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importStar(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const map_1 = require("../../libs/map");
const Heading_1 = require("../Heading");
const Icon_1 = require("../Icon");
const AccordionPanel_1 = require("./AccordionPanel");
const AccordionPanelItem_1 = require("./AccordionPanelItem");
const accordionPanelHelper_1 = require("./accordionPanelHelper");
const useClassNames_1 = require("./useClassNames");
const AccordionPanelTrigger = ({ children, className = '', headingType = 'blockTitle', headingTag, ...props }) => {
    const theme = (0, useTheme_1.useTheme)();
    const { name } = (0, react_1.useContext)(AccordionPanelItem_1.AccordionPanelItemContext);
    const { iconPosition, displayIcon, expandedItems, onClickTrigger, onClickProps, expandableMultiply, } = (0, react_1.useContext)(AccordionPanel_1.AccordionPanelContext);
    const classNames = (0, useClassNames_1.useClassNames)();
    const isExpanded = (0, map_1.getIsInclude)(expandedItems, name);
    const buttonClassNames = `${className} ${classNames.trigger}`;
    const handleClick = (0, react_1.useCallback)(() => {
        if (onClickTrigger)
            onClickTrigger(name, !isExpanded);
        if (onClickProps) {
            const newExpandedItems = (0, accordionPanelHelper_1.getNewExpandedItems)(expandedItems, name, !isExpanded, expandableMultiply);
            onClickProps((0, map_1.mapToKeyArray)(newExpandedItems));
        }
    }, [onClickTrigger, name, isExpanded, onClickProps, expandedItems, expandableMultiply]);
    return (react_1.default.createElement(Heading_1.Heading, { tag: headingTag, type: headingType },
        react_1.default.createElement(Button, { ...props, id: `${name}-trigger`, className: buttonClassNames, "aria-expanded": isExpanded, "aria-controls": `${name}-content`, themes: theme, onClick: handleClick, type: "button", "data-component": "AccordionHeaderButton" },
            displayIcon && iconPosition === 'left' && react_1.default.createElement(LeftIcon, null),
            react_1.default.createElement(TriggerTitle, null, children),
            displayIcon && iconPosition === 'right' && react_1.default.createElement(RightIcon, null))));
};
exports.AccordionPanelTrigger = AccordionPanelTrigger;
const TriggerTitle = styled_components_1.default.span `
  flex-grow: 1;
`;
const resetButtonStyle = (0, styled_components_1.css) `
  background-color: transparent;
  border: none;
  padding: 0;
  appearance: none;
`;
const Button = styled_components_1.default.button `
  ${resetButtonStyle}
  ${({ themes }) => {
    const { color, spacingByChar, shadow } = themes;
    return (0, styled_components_1.css) `
      display: flex;
      align-items: center;
      width: 100%;
      padding: ${spacingByChar(0.75)} ${spacingByChar(1)};
      cursor: pointer;
      font-size: inherit;
      text-align: left;

      &:hover {
        background-color: ${color.hoverColor(color.WHITE)};
        box-shadow: none;
      }

      &:focus-visible {
        ${shadow.focusIndicatorStyles}
      }

      /* TODO replace if impremented Layout component */
      & > * + * {
        margin-left: ${spacingByChar(0.5)};
      }
    `;
}}
`;
const LeftIcon = (0, styled_components_1.default)(Icon_1.FaCaretRightIcon) `
  transition: transform 0.3s;

  [aria-expanded='true'] > & {
    transform: rotate(90deg);
  }
`;
const RightIcon = (0, styled_components_1.default)(Icon_1.FaCaretUpIcon) `
  transition: transform 0.3s;

  [aria-expanded='true'] & {
    transform: rotate(-180deg);
  }
`;
//# sourceMappingURL=AccordionPanelTrigger.js.map