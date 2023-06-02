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
exports.usePartialRendering = void 0;
const react_1 = __importStar(require("react"));
const OPTION_INCREMENT_AMOUNT = 100;
function usePartialRendering({ items, minLength = 0, }) {
    const [currentItemLength, setCurrentItemLength] = (0, react_1.useState)(Math.max(OPTION_INCREMENT_AMOUNT, minLength));
    // minLength も考慮した実際のアイテム数を算出
    const actualLength = (0, react_1.useMemo)(() => {
        return Math.max(currentItemLength, minLength);
    }, [currentItemLength, minLength]);
    const partialItems = (0, react_1.useMemo)(() => items.slice(0, actualLength), [actualLength, items]);
    (0, react_1.useEffect)(() => {
        // currentItemLength を実際の値に補正
        setCurrentItemLength(actualLength);
    }, [actualLength]);
    const isAllItemsShown = (0, react_1.useMemo)(() => actualLength >= items.length, [actualLength, items.length]);
    const handleIntersect = (0, react_1.useCallback)(() => {
        setCurrentItemLength((current) => current + OPTION_INCREMENT_AMOUNT);
    }, []);
    const renderIntersection = (0, react_1.useCallback)(() => {
        if (isAllItemsShown) {
            return null;
        }
        return react_1.default.createElement(Intersection, { onIntersect: handleIntersect });
    }, [handleIntersect, isAllItemsShown]);
    return {
        items: partialItems,
        renderIntersection,
    };
}
exports.usePartialRendering = usePartialRendering;
const Intersection = ({ onIntersect }) => {
    const ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        const target = ref.current;
        if (target === null) {
            return;
        }
        // スクロール最下部に到達する度に表示するアイテム数を増加させるための IntersectionObserver
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                onIntersect();
            }
        });
        observer.observe(target);
        return () => observer.disconnect();
    }, [onIntersect]);
    return react_1.default.createElement("div", { ref: ref });
};
//# sourceMappingURL=usePartialRendering.js.map