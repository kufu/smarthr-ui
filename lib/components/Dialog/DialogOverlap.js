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
exports.DialogOverlap = void 0;
const react_1 = __importStar(require("react"));
const react_transition_group_1 = require("react-transition-group");
const styled_components_1 = __importDefault(require("styled-components"));
const useTheme_1 = require("../../hooks/useTheme");
const transitionClassName = 'shr-dialog-transition';
const DialogOverlap = ({ isOpen, children }) => {
    const theme = (0, useTheme_1.useTheme)();
    const [childrenBuffer, setChildrenBuffer] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (isOpen) {
            setChildrenBuffer(children);
        }
    }, [isOpen, children]);
    return (react_1.default.createElement(react_transition_group_1.CSSTransition, { classNames: transitionClassName, in: isOpen, timeout: {
            appear: 500,
            enter: 300,
            exit: 300,
        }, appear: true, unmountOnExit: true },
        react_1.default.createElement(Wrapper, { themes: theme }, isOpen ? children : childrenBuffer)));
};
exports.DialogOverlap = DialogOverlap;
const Wrapper = styled_components_1.default.div `
  position: absolute;
  z-index: ${({ themes }) => themes.zIndex.OVERLAP_BASE};

  &.${transitionClassName}-appear {
    opacity: 0;
  }
  &.${transitionClassName}-appear-active {
    transition: opacity 500ms;
    opacity: 1;
  }
  &.${transitionClassName}-enter {
    opacity: 0;
  }
  &.${transitionClassName}-enter-active {
    transition: opacity 300ms;
    opacity: 1;
  }
  &.${transitionClassName}-exit {
    opacity: 1;
  }
  &.${transitionClassName}-exit-active {
    transition: opacity 300ms;
    opacity: 0;
  }
`;
//# sourceMappingURL=DialogOverlap.js.map