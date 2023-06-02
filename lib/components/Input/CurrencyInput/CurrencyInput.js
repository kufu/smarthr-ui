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
exports.CurrencyInput = void 0;
const react_1 = __importStar(require("react"));
const Input_1 = require("../Input");
const currencyInputHelper_1 = require("./currencyInputHelper");
const useClassNames_1 = require("./useClassNames");
exports.CurrencyInput = (0, react_1.forwardRef)(({ onFormatValue, onFocus, onBlur, className = '', ...props }, ref) => {
    const innerRef = (0, react_1.useRef)(null);
    const [isFocused, setIsFocused] = (0, react_1.useState)(false);
    (0, react_1.useImperativeHandle)(ref, () => innerRef.current);
    const formatValue = (0, react_1.useCallback)((formatted = '') => {
        if (!innerRef.current || formatted === innerRef.current.value) {
            return;
        }
        innerRef.current.value = formatted;
        onFormatValue && onFormatValue(formatted);
    }, [onFormatValue]);
    (0, react_1.useEffect)(() => {
        if (props.value === undefined && props.defaultValue !== undefined) {
            formatValue((0, currencyInputHelper_1.formatCurrency)(props.defaultValue));
        }
        // when component did mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    (0, react_1.useEffect)(() => {
        if (!isFocused) {
            if (props.value !== undefined) {
                // for controlled component
                formatValue((0, currencyInputHelper_1.formatCurrency)(props.value));
            }
            else if (innerRef.current) {
                // for uncontrolled component
                formatValue((0, currencyInputHelper_1.formatCurrency)(innerRef.current.value));
            }
        }
    }, [isFocused, props.value, formatValue]);
    const handleFocus = (e) => {
        setIsFocused(true);
        if (innerRef.current) {
            const commaExcluded = innerRef.current.value.replace(/,/g, '');
            formatValue(commaExcluded);
        }
        onFocus && onFocus(e);
    };
    const handleBlur = (e) => {
        setIsFocused(false);
        onBlur && onBlur(e);
    };
    const classNames = (0, useClassNames_1.useClassNames)();
    return (
    // eslint-disable-next-line smarthr/a11y-input-has-name-attribute
    react_1.default.createElement(Input_1.Input, { ...props, type: "text", onFocus: handleFocus, onBlur: handleBlur, ref: innerRef, className: `${className} ${classNames.wrapper}` }));
});
//# sourceMappingURL=CurrencyInput.js.map