var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import React, { useCallback, useContext, useRef } from 'react';
import styled from 'styled-components';
import { Transition } from 'react-transition-group';
import { getIsInclude } from '../../libs/map';
import { AccordionPanelItemContext } from './AccordionPanelItem';
import { AccordionPanelContext } from './AccordionPanel';
var updateNodeHeight = function (node, wrapperRef) {
    var wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0;
    node.style.height = wrapperHeight + "px";
};
export var AccordionPanelContent = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b;
    var name = useContext(AccordionPanelItemContext).name;
    var expandedItems = useContext(AccordionPanelContext).expandedItems;
    var isInclude = getIsInclude(expandedItems, name);
    var wrapperRef = useRef(null);
    var handleEntering = useCallback(function (node) {
        updateNodeHeight(node, wrapperRef);
    }, [wrapperRef]);
    var handleEntered = function (node) {
        node.style.height = 'auto';
    };
    var handleExit = useCallback(function (node) {
        updateNodeHeight(node, wrapperRef);
    }, [wrapperRef]);
    var handleExiting = useCallback(function (node) {
        updateNodeHeight(node, wrapperRef);
    }, [wrapperRef]);
    var handleExited = function (node) {
        node.style.height = '0px';
    };
    return (React.createElement(Transition, { in: isInclude, onEntering: handleEntering, onEntered: handleEntered, onExit: handleExit, onExiting: handleExiting, onExited: handleExited, timeout: {
            enter: 300,
            exit: 0,
        } }, function (status) { return (React.createElement(CollapseContainer, { id: name + "-content", className: status + " " + className, "aria-labelledby": name + "-trigger", "aria-hidden": !isInclude },
        React.createElement("div", { ref: wrapperRef }, children))); }));
};
var CollapseContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  height: 0;\n  overflow: hidden;\n  transition: height 0.3s ease;\n\n  &.entered {\n    height: auto;\n  }\n"], ["\n  height: 0;\n  overflow: hidden;\n  transition: height 0.3s ease;\n\n  &.entered {\n    height: auto;\n  }\n"])));
var templateObject_1;
//# sourceMappingURL=AccordionPanelContent.js.map