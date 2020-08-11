"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccordionPanelContent = void 0;
var react_1 = __importStar(require("react"));
var styled_components_1 = __importDefault(require("styled-components"));
var react_transition_group_1 = require("react-transition-group");
var map_1 = require("../../libs/map");
var AccordionPanelItem_1 = require("./AccordionPanelItem");
var AccordionPanel_1 = require("./AccordionPanel");
var updateNodeHeight = function (node, wrapperRef) {
    var wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;
    node.style.height = wrapperHeight + "px";
};
exports.AccordionPanelContent = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var name = react_1.useContext(AccordionPanelItem_1.AccordionPanelItemContext).name;
    var expandedItems = react_1.useContext(AccordionPanel_1.AccordionPanelContext).expandedItems;
    var isInclude = map_1.getIsInclude(expandedItems, name);
    var wrapperRef = react_1.useRef(null);
    var handleEntering = react_1.useCallback(function (node) {
        updateNodeHeight(node, wrapperRef);
    }, [wrapperRef]);
    var handleEntered = function (node) {
        node.style.height = 'auto';
    };
    var handleExit = react_1.useCallback(function (node) {
        updateNodeHeight(node, wrapperRef);
    }, [wrapperRef]);
    var handleExiting = react_1.useCallback(function (node) {
        updateNodeHeight(node, wrapperRef);
    }, [wrapperRef]);
    var handleExited = function (node) {
        node.style.height = '0px';
    };
    return (react_1.default.createElement(react_transition_group_1.Transition, { in: isInclude, onEntering: handleEntering, onEntered: handleEntered, onExit: handleExit, onExiting: handleExiting, onExited: handleExited, timeout: {
            enter: 300,
            exit: 0,
        } }, function (status) { return (react_1.default.createElement(CollapseContainer, { id: name + "-content", className: status + " " + className, "aria-labelledby": name + "-trigger", "aria-hidden": !isInclude },
        react_1.default.createElement("div", { ref: wrapperRef }, children))); }));
};
var CollapseContainer = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 0;\n  overflow: hidden;\n  transition: height 0.3s ease;\n\n  &.entered {\n    height: auto;\n  }\n"], ["\n  height: 0;\n  overflow: hidden;\n  transition: height 0.3s ease;\n\n  &.entered {\n    height: auto;\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=AccordionPanelContent.js.map