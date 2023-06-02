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
exports.Tooltip = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const styled_components_1 = __importStar(require("styled-components"));
const useEnhancedEffect_1 = require("../../hooks/useEnhancedEffect");
const useId_1 = require("../../hooks/useId");
const useTheme_1 = require("../../hooks/useTheme");
const TooltipPortal_1 = require("./TooltipPortal");
const useClassNames_1 = require("./useClassNames");
const Tooltip = ({ message, children, triggerType, multiLine, ellipsisOnly = false, horizontal = 'left', vertical = 'bottom', tabIndex = 0, ariaDescribedbyTarget = 'wrapper', portalRootElement, className = '', onPointerEnter, onPointerLeave, onTouchStart, onTouchEnd, onFocus, onBlur, ...props }) => {
    const [portalRoot, setPortalRoot] = (0, react_1.useState)(null);
    const [isVisible, setIsVisible] = (0, react_1.useState)(false);
    const [rect, setRect] = (0, react_1.useState)(null);
    const ref = (0, react_1.useRef)(null);
    const tooltipId = (0, useId_1.useId)();
    const getHandlerToShow = (handler) => {
        return (e) => {
            handler && handler(e);
            if (!ref.current) {
                return;
            }
            if (ellipsisOnly) {
                const outerWidth = parseInt(window
                    .getComputedStyle(ref.current.parentNode, null)
                    .width.match(/\d+/)[0], 10);
                const wrapperWidth = ref.current.clientWidth;
                const existsEllipsis = outerWidth >= 0 && outerWidth <= wrapperWidth;
                if (!existsEllipsis) {
                    return;
                }
            }
            setRect(ref.current.getBoundingClientRect());
            setIsVisible(true);
        };
    };
    const getHandlerToHide = (handler) => {
        return (e) => {
            handler && handler(e);
            setIsVisible(false);
        };
    };
    const isIcon = triggerType === 'icon';
    (0, useEnhancedEffect_1.useEnhancedEffect)(() => {
        let element;
        if (portalRootElement) {
            element = portalRootElement;
        }
        else {
            element = document.createElement('div');
            document.body.appendChild(element);
        }
        setPortalRoot(element);
        return () => {
            if (portalRootElement)
                return;
            document.body.removeChild(element);
        };
    }, [portalRootElement]);
    const theme = (0, useTheme_1.useTheme)();
    const classNames = (0, useClassNames_1.useClassNames)();
    const childrenWithProps = ariaDescribedbyTarget === 'inner'
        ? react_1.default.cloneElement(children, { 'aria-describedby': tooltipId })
        : children;
    return (react_1.default.createElement(Wrapper, { ...props, "aria-describedby": ariaDescribedbyTarget === 'wrapper' ? tooltipId : undefined, ref: ref, onPointerEnter: getHandlerToShow(onPointerEnter), onTouchStart: getHandlerToShow(onTouchStart), onFocus: getHandlerToShow(onFocus), onPointerLeave: getHandlerToHide(onPointerLeave), onTouchEnd: getHandlerToHide(onTouchEnd), onBlur: getHandlerToHide(onBlur), isIcon: isIcon, tabIndex: tabIndex, className: `${className} ${classNames.wrapper}`, themes: theme },
        portalRoot &&
            (0, react_dom_1.createPortal)(react_1.default.createElement(TooltipPortal_1.TooltipPortal, { message: message, id: tooltipId, isVisible: isVisible, parentRect: rect, isIcon: isIcon, isMultiLine: multiLine, horizontal: horizontal, vertical: vertical }), portalRoot),
        childrenWithProps));
};
exports.Tooltip = Tooltip;
const Wrapper = styled_components_1.default.span `
  ${({ isIcon, themes: { shadow } }) => (0, styled_components_1.css) `
    display: inline-block;
    max-width: 100%;
    overflow-y: hidden;

    /* inline-block に overflow: visible 以外を指定すると、vertical-align が bottom margin edge に揃ってしまう
     * https://ja.stackoverflow.com/questions/2603/ */
    vertical-align: bottom;

    ${isIcon &&
    (0, styled_components_1.css) `
      line-height: 0;
    `}

    &:focus-visible {
      ${shadow.focusIndicatorStyles}
    }
  `}
`;
//# sourceMappingURL=Tooltip.js.map