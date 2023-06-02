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
exports.AccordionPanel = exports.AccordionPanelContext = void 0;
const react_1 = __importStar(require("react"));
const map_1 = require("../../libs/map");
const accordionPanelHelper_1 = require("./accordionPanelHelper");
const useClassNames_1 = require("./useClassNames");
exports.AccordionPanelContext = react_1.default.createContext({
    iconPosition: 'left',
    displayIcon: true,
    expandedItems: new Map(),
    expandableMultiply: false,
    parentRef: null,
});
const AccordionPanel = ({ children, iconPosition = 'left', displayIcon = true, expandableMultiply = false, defaultExpanded = [], className = '', onClick: onClickProps, ...props }) => {
    const [expandedItems, setExpanded] = (0, react_1.useState)((0, map_1.flatArrayToMap)(defaultExpanded));
    const parentRef = (0, react_1.useRef)(null);
    const classNames = (0, useClassNames_1.useClassNames)();
    const onClickTrigger = (0, react_1.useCallback)((itemName, isExpanded) => {
        setExpanded((0, accordionPanelHelper_1.getNewExpandedItems)(expandedItems, itemName, isExpanded, expandableMultiply));
    }, [expandableMultiply, expandedItems]);
    const handleKeyPress = (event) => {
        if (!parentRef?.current) {
            return;
        }
        const keyCode = event.keyCode;
        const item = event.target;
        switch (keyCode) {
            case accordionPanelHelper_1.keycodes.HOME: {
                event.preventDefault();
                (0, accordionPanelHelper_1.focusFirstSibling)(parentRef.current);
                break;
            }
            case accordionPanelHelper_1.keycodes.END: {
                event.preventDefault();
                (0, accordionPanelHelper_1.focusLastSibling)(parentRef.current);
                break;
            }
            case accordionPanelHelper_1.keycodes.LEFT:
            case accordionPanelHelper_1.keycodes.UP: {
                event.preventDefault();
                (0, accordionPanelHelper_1.focusPreviousSibling)(item, parentRef.current);
                break;
            }
            case accordionPanelHelper_1.keycodes.RIGHT:
            case accordionPanelHelper_1.keycodes.DOWN: {
                event.preventDefault();
                (0, accordionPanelHelper_1.focusNextSibling)(item, parentRef.current);
                break;
            }
        }
    };
    (0, react_1.useEffect)(() => {
        if (defaultExpanded.length > 0)
            setExpanded((0, map_1.flatArrayToMap)(defaultExpanded));
    }, [defaultExpanded]);
    return (react_1.default.createElement(exports.AccordionPanelContext.Provider, { value: {
            onClickTrigger,
            onClickProps,
            expandedItems,
            iconPosition,
            displayIcon,
            expandableMultiply,
            parentRef,
        } },
        react_1.default.createElement("div", { ...props, className: `${className} ${classNames.wrapper}`, ref: parentRef, onKeyDown: handleKeyPress }, children)));
};
exports.AccordionPanel = AccordionPanel;
//# sourceMappingURL=AccordionPanel.js.map