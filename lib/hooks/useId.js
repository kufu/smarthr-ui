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
exports.SequencePrefixIdProvider = exports.useId = void 0;
const react_1 = __importStar(require("react"));
const defaultContext = {
    prefix: 0,
    current: 0,
};
const IdContext = (0, react_1.createContext)(defaultContext);
function useId_OLD(defaultId) {
    const context = (0, react_1.useContext)(IdContext);
    return (0, react_1.useMemo)(() => defaultId || `id-${context.prefix}-${++context.current}`, [defaultId, context]);
}
exports.useId = 
// React v18 以降は React.useId を使う
'useId' in react_1.default ? react_1.default.useId : useId_OLD;
const SequencePrefixIdProvider = ({ children }) => {
    const context = (0, react_1.useContext)(IdContext);
    // increment `prefix` and reset `current` to 0 on every Provider
    const value = {
        prefix: context.prefix + 1,
        current: 0,
    };
    return react_1.default.createElement(IdContext.Provider, { value: value }, children);
};
exports.SequencePrefixIdProvider = SequencePrefixIdProvider;
//# sourceMappingURL=useId.js.map