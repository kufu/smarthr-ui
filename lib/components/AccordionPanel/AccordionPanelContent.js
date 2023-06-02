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
exports.AccordionPanelContent = void 0;
const react_1 = __importStar(require("react"));
const react_transition_group_1 = require("react-transition-group");
const styled_components_1 = __importDefault(require("styled-components"));
const map_1 = require("../../libs/map");
const AccordionPanel_1 = require("./AccordionPanel");
const AccordionPanelItem_1 = require("./AccordionPanelItem");
const useClassNames_1 = require("./useClassNames");
const duration = 200;
const AccordionPanelContent = ({ children, className = '', ...props }) => {
    const { name } = (0, react_1.useContext)(AccordionPanelItem_1.AccordionPanelItemContext);
    const { expandedItems } = (0, react_1.useContext)(AccordionPanel_1.AccordionPanelContext);
    const isInclude = (0, map_1.getIsInclude)(expandedItems, name);
    const wrapperRef = (0, react_1.useRef)(null);
    const classNames = (0, useClassNames_1.useClassNames)();
    const recalculateHeight = (0, react_1.useCallback)((node) => {
        const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;
        node.style.height = `${wrapperHeight}px`;
    }, [wrapperRef]);
    const handleEntered = (node) => {
        node.style.height = 'auto';
        node.style.visibility = 'visible';
    };
    const handleExited = (node) => {
        node.style.height = '0px';
        node.style.visibility = 'hidden';
    };
    return (react_1.default.createElement(react_transition_group_1.Transition, { in: isInclude, onEntering: recalculateHeight, onEntered: handleEntered, onExit: recalculateHeight, onExiting: recalculateHeight, onExited: handleExited, timeout: duration }, (status) => (react_1.default.createElement(CollapseContainer, { ...props, id: `${name}-content`, className: `${status} ${className} ${classNames.content}`, "aria-labelledby": `${name}-trigger`, "aria-hidden": !isInclude },
        react_1.default.createElement("div", { ref: wrapperRef }, children)))));
};
exports.AccordionPanelContent = AccordionPanelContent;
const CollapseContainer = styled_components_1.default.section `
  height: 0;
  overflow: hidden;
  transition: height ${duration}ms ease;
  visibility: hidden;

  &.entered {
    height: auto;
    overflow: visible;
    visibility: visible;
  }
`;
//# sourceMappingURL=AccordionPanelContent.js.map