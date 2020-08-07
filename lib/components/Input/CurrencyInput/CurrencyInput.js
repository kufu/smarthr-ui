"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyInput = void 0;
var react_1 = __importStar(require("react"));
var Input_1 = require("../Input");
exports.CurrencyInput = react_1.forwardRef(function (_a, ref) {
    var onFormatValue = _a.onFormatValue, onFocus = _a.onFocus, onBlur = _a.onBlur, props = __rest(_a, ["onFormatValue", "onFocus", "onBlur"]);
    var innerRef = react_1.useRef(null);
    var _b = react_1.useState(false), isFocused = _b[0], setIsFocused = _b[1];
    react_1.useImperativeHandle(ref, function () { return innerRef.current; });
    var formatValue = react_1.useCallback(function (formatted) {
        if (formatted === void 0) { formatted = ''; }
        if (!innerRef.current || formatted === innerRef.current.value) {
            return;
        }
        innerRef.current.value = formatted;
        onFormatValue && onFormatValue(formatted);
    }, [onFormatValue]);
    react_1.useEffect(function () {
        if (props.value === undefined && props.defaultValue !== undefined) {
            formatValue(formatCurrency(props.defaultValue));
        }
        // when component did mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    react_1.useEffect(function () {
        if (!isFocused) {
            if (props.value !== undefined) {
                // for controlled component
                formatValue(formatCurrency(props.value));
            }
            else if (innerRef.current) {
                // for uncontrolled component
                formatValue(formatCurrency(innerRef.current.value));
            }
        }
    }, [isFocused, props.value, formatValue]);
    var handleFocus = function (e) {
        setIsFocused(true);
        if (innerRef.current) {
            var commaExcluded = innerRef.current.value.replace(/,/g, '');
            formatValue(commaExcluded);
        }
        onFocus && onFocus(e);
    };
    var handleBlur = function (e) {
        setIsFocused(false);
        onBlur && onBlur(e);
    };
    return react_1.default.createElement(Input_1.Input, __assign({ type: "text", onFocus: handleFocus, onBlur: handleBlur, ref: innerRef }, props));
});
function formatCurrency(value) {
    if (!value) {
        return '';
    }
    var shaped = value
        .replace(/[０-９．]/g, function (s) { return String.fromCharCode(s.charCodeAt(0) - 0xfee0); }) // convert number and dot to half-width
        .replace(/[−ー]/, '-') // replace full-width minus
        .replace(/[^0-9.-]/g, ''); // exclude non-numeric characters
    var splited = shaped.split('.');
    var integerPart = splited[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // add comma to integer every 3 digits
    var formattedArray = Object.assign(splited, [integerPart]);
    return formattedArray.join('.');
}
//# sourceMappingURL=CurrencyInput.js.map