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
exports.usePortal = void 0;
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const useEnhancedEffect_1 = require("./useEnhancedEffect");
const ParentContext = (0, react_1.createContext)({
    seqs: [],
});
let portalSeq = 0;
function usePortal() {
    const portalRoot = (0, react_1.useRef)(typeof document === 'undefined' ? null : document.createElement('div')).current;
    const currentSeq = (0, react_1.useMemo)(() => ++portalSeq, []);
    const parent = (0, react_1.useContext)(ParentContext);
    const parentSeqs = parent.seqs.concat(currentSeq);
    (0, useEnhancedEffect_1.useEnhancedEffect)(() => {
        if (!portalRoot) {
            return;
        }
        portalRoot.dataset.portalChildOf = parentSeqs.join(',');
        document.body.appendChild(portalRoot);
        return () => {
            document.body.removeChild(portalRoot);
        };
        // spread parentSeqs array for deps
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...parentSeqs]);
    const isChildPortal = (0, react_1.useCallback)((element) => {
        return _isChildPortal(element, currentSeq);
    }, [currentSeq]);
    const PortalParentProvider = (0, react_1.useCallback)(({ children }) => {
        const value = {
            seqs: parentSeqs,
        };
        return react_1.default.createElement(ParentContext.Provider, { value: value }, children);
    }, 
    // spread parentSeqs array for deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...parentSeqs]);
    const wrappedCreatePortal = (0, react_1.useCallback)((children) => {
        if (portalRoot === null) {
            return null;
        }
        return (0, react_dom_1.createPortal)(children, portalRoot);
    }, [portalRoot]);
    return {
        portalRoot,
        isChildPortal,
        PortalParentProvider,
        createPortal: wrappedCreatePortal,
    };
}
exports.usePortal = usePortal;
function _isChildPortal(element, parentPortalSeq) {
    if (!element)
        return false;
    const childOf = element.dataset?.portalChildOf || '';
    const includesSeq = childOf.split(',').includes(String(parentPortalSeq));
    return includesSeq || _isChildPortal(element.parentElement, parentPortalSeq);
}
//# sourceMappingURL=usePortal.js.map