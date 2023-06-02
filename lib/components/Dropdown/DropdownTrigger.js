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
exports.DropdownTrigger = void 0;
const react_1 = __importStar(require("react"));
const styled_components_1 = __importDefault(require("styled-components"));
const tabbable_1 = require("../../libs/tabbable");
const util_1 = require("../../libs/util");
const Dropdown_1 = require("./Dropdown");
const useClassNames_1 = require("./useClassNames");
const DropdownTrigger = ({ children, className = '' }) => {
    const { active, onClickTrigger, contentId, triggerElementRef } = (0, react_1.useContext)(Dropdown_1.DropdownContext);
    const classNames = (0, useClassNames_1.useClassNames)();
    (0, react_1.useEffect)(() => {
        if (!triggerElementRef.current) {
            return;
        }
        // apply ARIA to all focusable elements in trigger
        const triggers = (0, tabbable_1.tabbable)(triggerElementRef.current, { shouldIgnoreVisibility: true });
        triggers.forEach((trigger) => {
            trigger.setAttribute('aria-expanded', String(active));
            trigger.setAttribute('aria-controls', contentId);
        });
    }, [triggerElementRef, active, contentId]);
    return (react_1.default.createElement(Wrapper, { ref: triggerElementRef, onClick: (e) => {
            // 引き金となる要素が disabled な場合は発火させない
            if ((0, util_1.includeDisabledTrigger)(children)) {
                return;
            }
            const rect = e.currentTarget.getBoundingClientRect();
            onClickTrigger({
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
            });
        }, className: `${className} ${classNames.wrapper}` }, react_1.default.Children.map(children, (child) => {
        const props = child.props ? child.props : {};
        const { className: classNameProps = '' } = props;
        switch (typeof child) {
            case 'string':
                return child;
            case 'object':
                return react_1.default.cloneElement(child, {
                    className: `${active ? 'active' : ''} ${classNameProps}`,
                });
            default:
                return null;
        }
    })));
};
exports.DropdownTrigger = DropdownTrigger;
const Wrapper = styled_components_1.default.div `
  display: inline-block;
`;
//# sourceMappingURL=DropdownTrigger.js.map