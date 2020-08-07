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
exports.Dropdown = exports.DropdownContext = void 0;
var react_1 = __importStar(require("react"));
var react_dom_1 = require("react-dom");
var dropdownHelper_1 = require("./dropdownHelper");
var initialRect = { top: 0, right: 0, bottom: 0, left: 0 };
exports.DropdownContext = react_1.createContext({
    active: false,
    triggerRect: initialRect,
    triggerElementRef: react_1.default.createRef(),
    onClickTrigger: function () {
        /* noop */
    },
    onClickCloser: function () {
        /* noop */
    },
    DropdownContentRoot: function () { return null; },
});
exports.Dropdown = function (_a) {
    var children = _a.children;
    var _b = react_1.useState(false), active = _b[0], setActive = _b[1];
    var _c = react_1.useState(initialRect), triggerRect = _c[0], setTriggerRect = _c[1];
    var portalElementRef = react_1.useRef(document.createElement('div'));
    var triggerElementRef = react_1.useRef(null);
    react_1.useEffect(function () {
        var onClickBody = function (e) {
            // ignore events from events within DropdownTrigger and DropdownContent
            if (e.target === triggerElementRef.current ||
                dropdownHelper_1.hasParentElement(e.target, portalElementRef.current)) {
                return;
            }
            setActive(false);
        };
        var portalElement = portalElementRef.current;
        document.body.appendChild(portalElement);
        document.body.addEventListener('click', onClickBody, false);
        return function () {
            document.body.removeChild(portalElement);
            document.body.removeEventListener('click', onClickBody, false);
        };
    }, []);
    // This is the root container of a dropdown content located in outside the DOM tree
    var DropdownContentRoot = react_1.useMemo(function () { return function (props) {
        if (!active)
            return null;
        return react_dom_1.createPortal(props.children, portalElementRef.current);
    }; }, [active]);
    // set the displayName explicit for DevTools
    DropdownContentRoot.displayName = 'DropdownContentRoot';
    return (react_1.default.createElement(exports.DropdownContext.Provider, { value: {
            active: active,
            triggerRect: triggerRect,
            triggerElementRef: triggerElementRef,
            onClickTrigger: function (rect) {
                var newActive = !active;
                setActive(newActive);
                if (newActive)
                    setTriggerRect(rect);
            },
            onClickCloser: function () {
                setActive(false);
            },
            DropdownContentRoot: DropdownContentRoot,
        } }, children));
};
//# sourceMappingURL=Dropdown.js.map