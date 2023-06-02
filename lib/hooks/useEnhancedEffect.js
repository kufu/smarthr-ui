"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEnhancedEffect = void 0;
const react_1 = require("react");
exports.useEnhancedEffect = typeof window !== 'undefined' ? react_1.useLayoutEffect : react_1.useEffect;
//# sourceMappingURL=useEnhancedEffect.js.map