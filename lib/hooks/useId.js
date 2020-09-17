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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequencePrefixIdProvider = exports.useId = void 0;
var react_1 = __importStar(require("react"));
var defaultContext = {
    prefix: 0,
    current: 0,
};
var IdContext = react_1.createContext(defaultContext);
function useId(defaultId) {
    var context = react_1.useContext(IdContext);
    return react_1.useMemo(function () { return defaultId || "id-" + context.prefix + "-" + ++context.current; }, [
        defaultId,
        context,
    ]);
}
exports.useId = useId;
exports.SequencePrefixIdProvider = function (_a) {
    var children = _a.children;
    var context = react_1.useContext(IdContext);
    // increment `prefix` and reset `current` to 0 on every Provider
    var value = {
        prefix: context.prefix + 1,
        current: 0,
    };
    return react_1.default.createElement(IdContext.Provider, { value: value }, children);
};
//# sourceMappingURL=useId.js.map