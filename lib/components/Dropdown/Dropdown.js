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
exports.Dropdown = exports.DropdownContext = void 0;
const react_1 = __importStar(require("react"));
const useId_1 = require("../../hooks/useId");
const usePortal_1 = require("../../hooks/usePortal");
const dropdownHelper_1 = require("./dropdownHelper");
const initialRect = { top: 0, right: 0, bottom: 0, left: 0 };
exports.DropdownContext = (0, react_1.createContext)({
    active: false,
    triggerRect: initialRect,
    triggerElementRef: react_1.default.createRef(),
    rootTriggerRef: null,
    onClickTrigger: () => {
        /* noop */
    },
    onClickCloser: () => {
        /* noop */
    },
    DropdownContentRoot: () => null,
    contentId: '',
});
const Dropdown = ({ children }) => {
    const [active, setActive] = (0, react_1.useState)(false);
    const [triggerRect, setTriggerRect] = (0, react_1.useState)(initialRect);
    const { rootTriggerRef } = (0, react_1.useContext)(exports.DropdownContext);
    const { createPortal, portalRoot, isChildPortal, PortalParentProvider } = (0, usePortal_1.usePortal)();
    const triggerElementRef = (0, react_1.useRef)(null);
    const contentId = (0, useId_1.useId)();
    if (portalRoot) {
        portalRoot.setAttribute('id', contentId);
    }
    (0, react_1.useEffect)(() => {
        const onClickBody = (e) => {
            // ignore events from events within DropdownTrigger and DropdownContent
            if ((0, dropdownHelper_1.isEventFromChild)(e, triggerElementRef.current) || isChildPortal(e.target)) {
                return;
            }
            setActive(false);
        };
        document.body.addEventListener('click', onClickBody, false);
        return () => {
            document.body.removeEventListener('click', onClickBody, false);
        };
    }, [isChildPortal, portalRoot]);
    // This is the root container of a dropdown content located in outside the DOM tree
    const DropdownContentRoot = (0, react_1.useMemo)(() => (props) => {
        if (!active)
            return null;
        return createPortal(props.children);
    }, [active, createPortal]);
    // set the displayName explicit for DevTools
    DropdownContentRoot.displayName = 'DropdownContentRoot';
    return (react_1.default.createElement(PortalParentProvider, null,
        react_1.default.createElement(exports.DropdownContext.Provider, { value: {
                active,
                triggerRect,
                triggerElementRef,
                rootTriggerRef: rootTriggerRef || triggerElementRef || null,
                onClickTrigger: (rect) => {
                    const newActive = !active;
                    setActive(newActive);
                    if (newActive)
                        setTriggerRect(rect);
                },
                onClickCloser: () => {
                    setActive(false);
                    // return focus to the Trigger
                    const trigger = (0, dropdownHelper_1.getFirstTabbable)(triggerElementRef);
                    if (trigger) {
                        trigger.focus();
                    }
                },
                DropdownContentRoot,
                contentId,
            } }, children)));
};
exports.Dropdown = Dropdown;
//# sourceMappingURL=Dropdown.js.map