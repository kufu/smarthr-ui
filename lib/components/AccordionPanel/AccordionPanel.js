"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccordionPanel = exports.AccordionPanelContext = void 0;
var react_1 = __importStar(require("react"));
var map_1 = require("../../libs/map");
var accordionPanelHelper_1 = require("./accordionPanelHelper");
exports.AccordionPanelContext = react_1.default.createContext({
    iconPosition: 'left',
    displayIcon: true,
    expandedItems: new Map(),
    expandableMultiply: false,
});
exports.AccordionPanel = function (_a) {
    var children = _a.children, _b = _a.iconPosition, iconPosition = _b === void 0 ? 'left' : _b, _c = _a.displayIcon, displayIcon = _c === void 0 ? true : _c, _d = _a.expandableMultiply, expandableMultiply = _d === void 0 ? false : _d, _e = _a.defaultExpanded, defaultExpanded = _e === void 0 ? [] : _e, _f = _a.className, className = _f === void 0 ? '' : _f, onClickProps = _a.onClick;
    var _g = react_1.useState(map_1.flatArrayToMap(defaultExpanded)), expandedItems = _g[0], setExpanded = _g[1];
    var onClickTrigger = react_1.useCallback(function (itemName, isExpanded) {
        setExpanded(accordionPanelHelper_1.getNewExpandedItems(expandedItems, itemName, isExpanded, expandableMultiply));
    }, [expandableMultiply, expandedItems]);
    react_1.useEffect(function () {
        if (defaultExpanded.length > 0)
            setExpanded(map_1.flatArrayToMap(defaultExpanded));
    }, [defaultExpanded]);
    return (react_1.default.createElement(exports.AccordionPanelContext.Provider, { value: {
            onClickTrigger: onClickTrigger,
            onClickProps: onClickProps,
            expandedItems: expandedItems,
            iconPosition: iconPosition,
            displayIcon: displayIcon,
            expandableMultiply: expandableMultiply,
        } },
        react_1.default.createElement("div", { className: className }, children)));
};
//# sourceMappingURL=AccordionPanel.js.map