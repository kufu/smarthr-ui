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
exports.DialogWrapper = exports.DialogContext = void 0;
var react_1 = __importStar(require("react"));
var react_dom_1 = require("react-dom");
exports.DialogContext = react_1.createContext({
    onClickTrigger: function () {
        /* noop */
    },
    onClickClose: function () {
        /* noop */
    },
    DialogContentRoot: function () { return null; },
    active: false,
});
exports.DialogWrapper = function (_a) {
    var children = _a.children;
    var _b = react_1.useState(false), active = _b[0], setActive = _b[1];
    var element = react_1.useRef(document.createElement('div')).current;
    react_1.useEffect(function () {
        document.body.appendChild(element);
        return function () {
            document.body.removeChild(element);
        };
    }, [element]);
    // This is the root container of a dialog content located in outside the DOM tree
    var DialogContentRoot = react_1.useMemo(function () { return function (props) {
        return react_dom_1.createPortal(props.children, element);
    }; }, [element]);
    // set the displayName explicit for DevTools
    DialogContentRoot.displayName = 'DialogContentRoot';
    return (react_1.default.createElement(exports.DialogContext.Provider, { value: {
            onClickTrigger: function () { return setActive(true); },
            onClickClose: function () { return setActive(false); },
            DialogContentRoot: DialogContentRoot,
            active: active,
        } }, children));
};
//# sourceMappingURL=DialogWrapper.js.map